<?php
//require_once FILE .'conf/setup.php';
require_once FILE.'conf/setup.php';
require_once FILE .'lib/google/Google_Client.php';
require_once FILE .'lib/google/Google_Oauth2Service.php';


class Loging extends Controller {
    public static $status;
    private $client;
    private $oauth2;
    public function __construct() {
        parent::__construct();
        $this->model = $this->loadModel('check');
        $this->client = new Google_Client();
        $this->client->setApplicationName("Idiot Minds Google Login Functionallity");
        $this->client->setClientId(CLIENT_ID);
        $this->client->setClientSecret(CLIENT_SECRET);
        $this->client->setRedirectUri("http://localhost/src/app/loging/login");
        $this->client->setApprovalPrompt(APPROVAL_PROMPT);
        $this->client->setAccessType(ACCESS_TYPE);
        $this->oauth2 = new Google_Oauth2Service($this->client);
    }

    public function index() {
//        $this->view->renderHtml('signin/index');
    }

    public function login(){
        if (isset($_GET['code'])) {
            $this->client->authenticate($_GET['code']);
            $_SESSION['token'] = $this->client->getAccessToken();
        }
        if (isset($_SESSION['token'])) {
            $this->client->setAccessToken($_SESSION['token']);
        }
        if (isset($_REQUEST['error'])) {
            echo '<script type="text/javascript">window.close();</script>'; exit;
        }
        if ($this->client->getAccessToken()) {
            $user = $this->oauth2->userinfo->get();
            $_SESSION['gm_user']=$user;
            $_SESSION['gm_ID']= $_SESSION['gm_user']['id'];
            $_SESSION['gm_token'] = $this->client->getAccessToken();
            $_SESSION['login']=1;
            $_SESSION['logout_link']="http://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost/src/app/loging/logout";
            $status=$_SESSION['status'];
            if($status==='update'){
                $this->model=$this->loadModel('user');
                $info=$this->model->getInfoFB($_SESSION['fb_ID']);
                $id=$info['id'];
                $this->updateId($id);
                $this->model=$this->loadModel('user');
                $info=$this->model->getInfoFB($_SESSION['fb_ID']);
                print_r($info);
                echo 111;
                exit;
            }else{
                $this->checkUser();
                exit;
            }
        } else {
            $authUrl = $this->client->createAuthUrl();
            header("Location:".$authUrl);
        }

    }
    public function login_gm(){
        $_SESSION['status']='update';
        $this->login();
    }
    public  function updateId($id){
        $this->model=$this->loadModel('regist');
        $this->model->updateGM($_SESSION['gm_ID'],$id);
    }
    public function checkUser(){
//        print_r($_SESSION["gm_ID"]);
        $check= $this->model->checkUserGM($_SESSION["gm_ID"]);
        if($check){
            header("Location:".URL."app/calendar");
            exit;
        }
        else {
            $_SESSION['status']='regist';
            if($this->model->checkEmail($_SESSION["gm_user"]['email'])){
                $_SESSION['has_email']=1;
                header("Location:".URL."app/loginf/login");
                exit;
            }
            else{
                header('Content-type: text/html; charset=utf-8');
                header("Location:".URL."app/regist");
                exit;
            }
        }

    }
    public function logoutb(){
        echo "<a  href='https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost/src/app/loging/logout'>Logout</a>";
    }
    public function logout(){
        session_destroy();
        $_SESSION['login']=0;
        header("Location:".URL."app/signin");
    }
    private function checkEmail($email){
        return $this->model->checkEmail($email);
    }
}

?>