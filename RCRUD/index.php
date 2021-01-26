<?php
require_once 'class/app.class.php';

$user = new Users();

header('Access-Control-Allow-Origin: *');


if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $userId = empty($_GET['id']) ? '' : $_GET['id'];

    echo $users = $user->get($userId);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"),$post_vars);

    // echo $_GET['id'];
    // print_r($post_vars);
    echo $user->update($_GET['id'], $post_vars);
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);

    echo $user->create($_POST);
    exit();
}

// if ($_POST['METHOD'] == 'PUT') {
//     unset($_POST['METHOD']);

//     echo $user->update($_GET, $_POST);
//     exit();
// }

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);

    $user->destroy($_GET['id']);
    exit();
}
