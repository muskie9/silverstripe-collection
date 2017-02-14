<?php

namespace Dynamic\Collection\Extension;

use SilverStripe\Core\Convert;
use SilverStripe\Core\Extension;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataList;
use SilverStripe\ORM\Map;
use SilverStripe\ORM\PaginatedList;
use SilverStripe\ORM\GroupedList;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\Form;
use SilverStripe\View\Requirements;
use SilverStripe\Dev\Debug;

/**
 * Class CollectionExtension
 * @package Dynamic\Collection\Extension
 */
class CollectionExtension extends Extension
{

    /**
     * @var bool
     */
    private static $dynamic_form = false;

    /**
     * @var array
     */
    private static $allowed_actions = array(
        'CollectionJSON' => '->canAccessJSON',
        'CollectionFormJSON' => '->canAccessJSON',
        'CollectionSearchForm',
    );

    /**
     * @var DataList|ArrayList
     */
    private $collection;

    public function onAfterInit()
    {
        if ($this->owner->config()->get('dynamic_form') && $this->canAccessJSON()) {
            Requirements::javascript('collection/scripts/build/bundle.js');
        }
    }

    /**
     * @return ArrayList|DataList
     */
    public function getCollection()
    {
        if (!$this->collection) {
            $this->setCollection($this->owner->request);
        }
        return $this->collection;
    }

    /**
     * @param HTTPRequest|null $request
     * @return $this
     */
    public function setCollection(HTTPRequest $request = null)
    {
        if ($request === null) {
            $request = $this->owner->request;
        }
        $searchCriteria = $request->requestVars();

        // allow $searchCriteria to be updated via extension
        $this->owner->extend('updateCollectionFilters', $searchCriteria);

        $object = $this->getCollectionObject();

        $context = (method_exists($object, 'getCustomSearchContext'))
            ? singleton($object)->getCustomSearchContext()
            : singleton($object)->getDefaultSearchContext();

        $sort = ($request->getVar('Sort'))
            ? (string)$request->getVar('Sort')
            : singleton($object)->stat('default_sort');

        $collection = $context->getResults($searchCriteria)->sort($sort);

        // allow $collection to be updated via extension
        $this->owner->extend('updateCollectionItems', $collection, $searchCriteria);

        $this->collection = $collection;
        return $this;
    }

    /**
     * @return string
     */
    protected function getCollectionObject()
    {
        if ($object = $this->owner->config()->managed_object) {
            $object = (string)$object;
        } else {
            $object = 'Page';
        }

        $this->owner->extend('updateCollectionObject', $object);

        return $object;
    }

    /**
     * @return int
     */
    protected function getCollectionSize()
    {
        if ($object = $this->owner->config()->page_size) {
            return (int)$object;
        }

        return 10;
    }

    /**
     * @return string
     */
    public function CollectionJSON()
    {
        return Convert::array2json($this->getCollection()->toNestedArray());
    }

    /**
     * @return string
     */
    public function CollectionFormJSON()
    {
        $fields = $this->CollectionSearchForm()->Fields();
        $fieldData = [];
        foreach ($fields as $field) {
            if ($field instanceof DropdownField) {
                $fieldData['fields'] = [
                    'type' => 'Dropdown',
                    'source' => (is_array($field->getSource()) && !$field->getSource() instanceof Map)
                        ? $field->getSource() : $field->getSource()->toArray(),
                    'name' => $field->getName(),
                ];
            }
        }
        return Convert::array2json($fieldData);
    }

    /**
     * @param HTTPRequest|null $request
     * @return PaginatedList
     */
    public function PaginatedList(HTTPRequest $request = null)
    {
        if ($request === null) {
            $request = $this->owner->request;
        }
        $start = ($request->getVar('start')) ? (int)$request->getVar('start') : 0;

        $records = PaginatedList::create($this->getCollection(), $this->owner->request);
        $records->setPageStart($start);
        $records->setPageLength($this->getCollectionSize());

        // allow $records to be updated via extension
        $this->owner->extend('updatePaginatedList', $records);

        return $records;
    }

    /**
     * @return GroupedList
     */
    public function GroupedList()
    {
        $records = GroupedList::create($this->getCollection());

        // allow $records to be updated via extension
        $this->owner->extend('updateGroupedList', $records);

        return $records;
    }

    /**
     * @return Form
     */
    public function CollectionSearchForm()
    {
        $object = $this->getCollectionObject();
        $request = ($this->owner->request) ? $this->owner->request : $this->owner->parentController->getRequest();
        $sort = ($request->getVar('Sort')) ? (string)$request->getVar('Sort') : singleton($object)->stat('default_sort');

        $context = (method_exists($object, 'getCustomSearchContext')) ? singleton($object)->getCustomSearchContext() : singleton($object)->getDefaultSearchContext();
        $fields = $context->getSearchFields();

        // add sort field if managed object specs getSortOptions()
        if (method_exists($object, 'getSortOptions')) {
            $sortOptions = singleton($object)->getSortOptions();
            if (singleton($object)->stat('default_sort')) {
                $defaultSort = array(str_replace('"', '', singleton($object)->stat('default_sort')) => 'Default');
                $sortOptions = array_merge($defaultSort, $sortOptions);
            }
            $fields->add(
                DropdownField::create('Sort', 'Sort by:', $sortOptions, $sort)
            );
        }

        // allow $fields to be updated via extension
        $this->owner->extend('updateCollectionFields', $fields);

        $actions = new FieldList(
            new FormAction($this->owner->Link(), 'Search')
        );

        if (class_exists('BootstrapForm')) {
            $form = BootstrapForm::create(
                $this->owner,
                'CollectionSearchForm',
                $fields,
                $actions
            );
        } else {
            $form = Form::create(
                $this->owner,
                'CollectionSearchForm',
                $fields,
                $actions
            );
        }
        $form
            ->setFormMethod('get')
            ->disableSecurityToken()
            ->loadDataFrom($request->getVars())
            ->setFormAction($this->owner->Link());

        // allow $form to be extended via extension
        $this->owner->extend('updateCollectionForm', $form);

        return $form;
    }

    /**
     * @return mixed
     */
    public function canAccessJSON()
    {
        return ($this->owner->config()->get('dynamic_form'));
    }

}
