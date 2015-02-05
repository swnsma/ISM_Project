<?php
class Bootstrap {
    function __construct() {
        $time = 3600*24;
        $ses = 'MYSES';
        Session::init($time,$ses);
        Session::set('status', 'not');
        $request = Request::getInstance();
        $urla=$request->getUrl();
        if(!Session::has('unusedLink')){
            Session::set('unusedLink',$urla );
        }
        require_once DOC_ROOT . 'module/app/controllers/regist.php';
        $controller = $request->getController();
        $action=$request->getAction();
        $module = $request->getModule();
        $this->checkRoute($controller,$action);
        $file = DOC_ROOT  . 'module/' . $module . '/controllers/' . $controller . '.php';
        if (file_exists($file)) {
            require_once $file;
            $c = new $controller;
        } else {
            require_once  DOC_ROOT . 'module/app/controllers/error.php';
            $c = new Error();
        }
        $c->run($request->getAction());
    }

    protected function checkController($controller){
        return
            $controller=='calendar'||
            $controller=='grouppage'||
            $controller=='admin';
    }
    protected function checkRoute($controller,$action){
        if((!(Session::has('fb_ID')&&!(empty($_SESSION['fb_ID'])))&&
                (!(Session::has('gm_ID')&&$_SESSION['gm_ID']&&!(empty($_SESSION['gm_ID'])))))
            &&($this->checkController($controller))
        )
        {
            header("Location:".URL."app/signin");
            exit;
        }

        if(((isset($_SESSION['fb_ID'])&&$_SESSION['fb_ID']&&!(empty($_SESSION['fb_ID'])))||
                (isset($_SESSION['gm_ID'])&&$_SESSION['gm_ID']&&!(empty($_SESSION['gm_ID']))))&&
            $controller==='signin'
        )
        {
            header("Location:".URL."app/calendar");
            exit;
        }

        if($_SESSION['status']&&($_SESSION['status']=="regist")&&$controller!="regist"&&$action!="back_signin"){
            if($_SESSION['has_email']===1){
                exit;
            }
            else{
                header("Location:".URL."app/regist");
                exit;
            }
        }
    }

}
?>