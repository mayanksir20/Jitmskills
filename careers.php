<?php
// --- PHP MAIL LOGIC ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "info@jitmskills.com";
    $subject = "New Job Application: " . ($_POST['designation'] ?? 'Not Specified');
    $boundary = md5(time());

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From: Career-Portal <webmaster@jitmskills.com>\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // Checkbox Handling logic
    $noida_hq = isset($_POST['noida_hq']) ? "Agree" : "Not Agree";
    $transfer_policy = isset($_POST['transfer_policy']) ? "Agree" : "Not Agree";

    $message_body = "<h3>Application Details</h3><table border='1' cellpadding='8' style='border-collapse:collapse; width:100%;'>";
    foreach($_POST as $key => $value) {
        if(!empty($value) && $key != 'noida_hq' && $key != 'transfer_policy') {
            $message_body .= "<tr><td style='background:#f4f4f4;'><b>" . ucfirst(str_replace('_', ' ', $key)) . "</b></td><td>" . htmlspecialchars($value) . "</td></tr>";
        }
    }
    $message_body .= "<tr><td style='background:#f4f4f4;'><b>Ready for Noida HQ</b></td><td>$noida_hq</td></tr>";
    $message_body .= "<tr><td style='background:#f4f4f4;'><b>Agree to Transfer</b></td><td>$transfer_policy</td></tr>";
    $message_body .= "</table>";

    $message = "--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n<html><body>$message_body</body></html>\r\n";

    if (isset($_FILES['resume']) && $_FILES['resume']['error'] == UPLOAD_ERR_OK) {
        $file_name = $_FILES['resume']['name'];
        $file_data = chunk_split(base64_encode(file_get_contents($_FILES['resume']['tmp_name'])));
        $message .= "--$boundary\r\nContent-Type: application/octet-stream; name=\"$file_name\"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"$file_name\"\r\n\r\n$file_data\r\n";
    }
    $message .= "--$boundary--";

    if(mail($to, $subject, $message, $headers)) { 
        echo "Success"; 
    } else { 
        echo "Error"; 
    }
    exit;
}
?>