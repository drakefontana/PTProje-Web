<?php


$srvr = 'designer-turkey.com';

foreach($_POST as $key => $value) {
    $email_message .= '
          <tr>
            <th>'. $key .':</th>
            <td>'. $value .'</td>
          </tr>';
}

if(empty($error_msg)){

    $userinfo = '<i>Browser</i>: '.@$_SERVER['HTTP_USER_AGENT'].
                '<br> <i>Country IP</i>: <a href="http://whatismyipaddress.com/ip/'.@$_SERVER['REMOTE_ADDR'].'">'.@$_SERVER['REMOTE_ADDR'].'</a>
                 <br> <i>Language</i>: '.@$_SERVER['HTTP_ACCEPT_LANGUAGE'];

    $to = 'osama@propertyturkey.com,drake@propertyturkey.com' ; 
    // $to = $to.',muhammad@propertyturkey.com,osama@propertyturkey.com,casper2105@gmail.com';
    $email_subject = "Contact from : ".$_POST['name'];
    $email_body = '
    
        <table cellpadding="1">
          <tr>
            <th colspan="2">New message from '.$_SERVER['SERVER_NAME'].'</th>
          </tr>
          '.$email_message.'
          <tr>
            <th>Info: </th>
            <td>'.$userinfo.'</td>
          </tr>
        </table>';

    $header_array = [
        "MIME-Version: 1.0",
        "Content-type: text/html; charset=UTF-8",
        "From: noreply@$srvr",
        "X-Mailer: php",
        "Reply-To: noreply@$srvr",
        'Cc: muhammad@propertyturkey.com',
        'Bcc: osama@propertyturkey.com',
        'Bcc: drake@propertyturkey.com',
    ];

    $headers = implode("\r\n", $header_array);
    
    if(@mail($to, $email_subject, $email_body, $headers)){
        echo json_encode(['status'=>'SUCCESS', 'msg'=>('email-sent')]); die();
    }else{
        echo json_encode(['status'=>'FAIL', 'msg'=>('email-fail')]); die();
    }
}else{
    echo json_encode(['status'=>'FAIL', 'msg'=>$error_msg]); die();
}
?>