<?php

abstract class Controller {
    function __construct() {
        $this->view = new View();
    }

    public function loadModel($name) {
        $path = DOCUMENT_ROOT . 'models/'. Request::getInstance()->getModule() . '/'. $name . '_model.php';
        if (file_exists($path)) {
            require_once $path;
            $modelName = ucfirst($name) . 'Model';
            $this->model = new $modelName;
            return $this->model->getData();
        }
        return null;
    }

    public function run($actionName) {
        $this->$actionName();
    }
}

?>