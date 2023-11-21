<?php

$srvr = 'designer-turkey.com';
$error_msg = ''; // Initialize error message variable
$email_message = ''; // Initialize email message variable

// Error reporting and logging settings
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/php-error.log'); // Adjust the path as needed

// Validate and sanitize input
foreach ($_POST as $key => $value) {
    if (empty($value)) {
        $error_msg .= "Field $key is empty. ";
    }
    $email_message .= '
        <tr>
            <th>' . htmlspecialchars($key) . ':</th>
            <td>' . htmlspecialchars($value) . '</td>
        </tr>';
}

if (empty($error_msg)) {
    $userinfo = '<i>Browser</i>: ' . @$_SERVER['HTTP_USER_AGENT'] .
        '<br> <i>Country IP</i>: <a href="http://whatismyipaddress.com/ip/' . @$_SERVER['REMOTE_ADDR'] . '">' . @$_SERVER['REMOTE_ADDR'] . '</a>
                 <br> <i>Language</i>: ' . @$_SERVER['HTTP_ACCEPT_LANGUAGE'];

    $to = 'osama@propertyturkey.com,drake@propertyturkey.com';
    $email_subject = "Contact from : " . $_POST['name'];
    $email_body = '
        <table cellpadding="1">
            <tr>
                <th colspan="2">New message from ' . $_SERVER['SERVER_NAME'] . '</th>
            </tr>
            ' . $email_message . '
            <tr>
                <th>Info: </th>
                <td>' . $userinfo . '</td>
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

    if (@mail($to, $email_subject, $email_body, $headers)) {
        echo json_encode(['status' => 'SUCCESS', 'msg' => 'Email sent successfully']);
    } else {
        error_log("Mail sending failed."); // Log error for server-side debugging
        echo json_encode(['status' => 'FAIL', 'msg' => 'Failed to send email']);
    }
} else {
    // Log detailed error message
    error_log("Form submission error: " . $error_msg);
    echo json_encode(['status' => 'FAIL', 'msg' => $error_msg]);
}

?>
