<?php
class Users {
    function __construct() {
        $this->hmartepost = 'http://local.hmartepost.com/moodle38/webservice/rest/server.php?wstoken=11ef0da3e0d571ef0b33f3b8ceb7df39&wsfunction=';
    }

    public function get ($userId = null) {
        $ch = curl_init();

        $urlR = $userId ?
        $this->hmartepost . 'core_user_get_users&moodlewsrestformat=json&criteria[0][key]=id&criteria[0][value]='.$userId
        :
        $this->hmartepost . 'tool_dataprivacy_get_users&moodlewsrestformat=json&query=0';

        curl_setopt($ch, CURLOPT_URL, $urlR);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $res = curl_exec($ch);
        
        return $res;
        
        curl_close($ch);
    }

    public function create ($dataIn) {
        $dataout = [
            'users[0][username]' => $dataIn['username'],
            'users[0][password]' => $dataIn['pass'],
            'users[0][firstname]' => $dataIn['firstname'],
            'users[0][lastname]' => $dataIn['lastname'],
            'users[0][email]' => $dataIn['email']
        ];

        $defaults = array(
            CURLOPT_URL => $this->hmartepost . 'core_user_create_users&moodlewsrestformat=json',
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $dataout,
        );
        $ch = curl_init();
        curl_setopt_array($ch, ($defaults));
        $res1 = curl_exec($ch);

        $someArray = json_decode($res1, true);
        print_r($someArray);        // Dump all data of the Array

        // return $someArray[0]["id"];
        $res = array_merge($someArray[0], $dataIn);

        return $res;
        
        curl_close($ch);
    }

    public function update ($get, $post) {
        $defaults = array(
            CURLOPT_URL => $this->hmartepost . 'core_user_update_users&moodlewsrestformat=json',
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $post,
        );
        $ch = curl_init();
        curl_setopt_array($ch, ($defaults));
        $res = curl_exec($ch);
        
        return $res;
        
        curl_close($ch);
    }

    public function destroy ($userId) {
        $ch = curl_init();

        $urlR = $this->hmartepost . 'core_user_delete_users&moodlewsrestformat=json&userids[0]='.$userId;

        curl_setopt($ch, CURLOPT_URL, $urlR);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $res = curl_exec($ch);
        
        return $res;
        
        curl_close($ch);
    }
}
