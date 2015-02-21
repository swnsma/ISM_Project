<?php

/**
 * Created by PhpStorm.
 * User: Таня
 * Date: 25.01.2015
 * Time: 20:38
 */
class UserModel extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getUserInfo($id)
    {
        try {
            $d = $this->db->query("SELECT* FROM `user` WHERE id=$id;")->fetchAll(PDO::FETCH_ASSOC);
            if (isset($d[0])) {
                return $d[0];
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function getCurrentUserInfo()
    {
        $id = Session::get('id');
        $userInfo = Array();
        $sql = <<<SQL
                select
                    user.name,
                    user.surname,
                    user.email,
                    user.phone,
                    user.fb_id,
                    user.gm_id,
                    user.id,
                    role.title
                from user
                inner join role
                on user.role_id = role.id
                where user.id='$id'
SQL;
        $userInfo = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        if (count($userInfo) === 0) {
            return null;
        }
        return $userInfo[0];
    }

    public function getInfoFB($fb_id)
    {
        try {
            $request = <<<TANIA
select * from user
where fb_id='$fb_id'
TANIA;
            $var = $this->db->query($request)->fetchAll(PDO::FETCH_ASSOC);
            if (isset($var[0]))
                return $var[0];
            else return null;
        } catch (PDOException $e) {
            echo $e->getMessage();
            return null;
        }
    }

    public function getInfoGM($gm_id)
    {
        try {
            $request = <<<TANIA
            select * from user
            where gm_id='$gm_id'
TANIA;

            $var = $this->db->query($request)->fetchAll(PDO::FETCH_ASSOC);
            return $var[0];
        } catch (PDOException $e) {
            echo $e->getMessage();
            return null;
        }
    }

    public function getIdFB($fb_id)
    {
        try {
            $request = <<<TANIA
select id from user
where fb_id='$fb_id'
TANIA;
            $var = $this->db->query($request)->fetchAll(PDO::FETCH_ASSOC);
            if (isset($var[0]['id'])) {
                return $var[0]['id'];
            } else return null;
        } catch (PDOException $e) {
            echo $e->getMessage();
            return null;
        }
    }

    public function getIdGM($gm_id)
    {
        try {
            $request = <<<TANIA
            select id from user
            where gm_id='$gm_id'
TANIA;

            $var = $this->db->query($request)->fetchAll(PDO::FETCH_ASSOC);
            return $var[0]['id'];
        } catch (PDOException $e) {
            echo $e->getMessage();
            return null;
        }
    }


    public function getOurTeacher()
    {
        $sql = "Select u.name, u.id, u.surname,
uu.id as uu
        from 'user' as u
        INNER JOIN role as r ON
        r.id = u.role_id
        LEFT JOIN 'unconfirmed_user' as uu ON
        uu.id=u.id
        WHERE r.title='teacher'";
        try {
            $date = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            for ($var = 0; $var < count($date); ++$var) {
                if (!isset($date[$var]['uu'])) {
                    array_push($result, $date[$var]);
                }
            }
//            print_r($result);
            return $result;
        } catch (PDOException $e) {
            echo $e->getMessage();
            return null;
        }

    }

    public function checkUnconfirmed($id)
    {
        try {
            $sql = <<<sql
                select * from unconfirmed_user where id='$id'
sql;
            $date = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
            return count($date);
        } catch (PDOException $e) {
            echo $e->getMessage();
            return null;
        }
    }

    public function getInfo($lessonId)
    {
        $r = <<<HERE
        SELECT
            `lesson`.`lesson_info` as lesson_info
             from lesson
        WHERE `lesson`.`id` = $lessonId

HERE;

        try {
            $request = $this->db->query($r)->fetchAll(PDO::FETCH_ASSOC);
            return $request;
        } catch (PDOException $e) {
            echo $e->getMessage();
            return null;
        }
    }

    public function newInfo($lessonId, $value)
    {
        try {
            $STH = $this->db->prepare("UPDATE lesson SET lesson_info = :value WHERE id=:id");
            $STH->execute(array('value' => $value, 'id' => $lessonId));
        } catch (PDOException $e) {
            echo $e->getMessage();
        }


    }

    public function saveTask($studentId, $name, $lessonId)
    {
        $r = <<<HERE
        INSERT INTO `result` (owner, link,lesson_id) VALUES ($studentId,'$name',$lessonId);
HERE;
        try {
            $request = $this->db->query($r)->fetchAll(PDO::FETCH_ASSOC);
            return $request;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function loadTasks($lessonId)
    {
        $r = <<<HERE
SELECT
            `result`.`link` as link,
             `user`.`name` as name,
             `user`.`surname` as surname
from `user`, `result`
        WHERE `result`.`owner`=`user`.`id` AND `result`.`lesson_id` = $lessonId

HERE;

        try {
            $request = $this->db->query($r)->fetchAll(PDO::FETCH_ASSOC);
            return $request;
        } catch (PDOException $e) {
            echo $e->getMessage();
            return null;
        }
    }
    function setDeadLine($id, $deadline){
        $r=<<<SETDAD
            UPDATE `lesson`
            SET `deadline`="$deadline";
            WHERE id=$id;
SETDAD;
        $this->db->query($r);

    }
    function getDeadLine($id){
        $r=<<<GETDEAD
            SELECT `deadline`
            FROM `lesson`
            WHERE `lesson`.`id`='$id';
GETDEAD;
        $var =$this->db->query($r)->fetchAll(PDO::FETCH_ASSOC);
        if(!is_null($var[0]['deadline']))
        {
            return $var[0]['deadline'];
        }else return "Нет";

    }
}