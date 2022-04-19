<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	// use PHPMailer\PHPMailer\SMTP; // если используются настройки SMTP

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';
	// require 'phpmailer/src/SMTP.php'; // если используются настройки SMTP
	// Настройки PHPMailer
	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	// Настройки SMTP (если не используется почтовый сервер хостинга)
	// Эту часть не используем для OpenServer (там свои настройки smtp)

    // $mail->isSMTP();                                            
    // $mail->Host       = 'smtp.mail.ru'; // SMTP сервера вашей почты
    // $mail->SMTPAuth   = true;                                   
    // $mail->Username   = 'diva84@mail.ru'; // Логин на почте
    // $mail->Password   = 'mHemYMbRarAdexagrpZZ'; // Пароль на почте
    // $mail->SMTPSecure = 'TLS'; 	           						
    // $mail->Port       = 587;   

	// Адрес самой почты и имя отправителя (!обязательно указывать почту как в настройках SMTP!)
	$mail->setFrom('iburih@gmail.com', 'Письмо');
	// Получатель письма
	$mail->addAddress('diva84@mail.ru');
	// $mail->addAddress('iburih@gmail.com'); // Ещё один, если нужен
	//Тема письма
	$mail->Subject = 'Квиз"';

	//* ======= Формирование самого письма ==========

	//* Переменные, которые отправляет пользователь (можно вставлять в тело письма)
	// $name = $_POST['name'];
	// $email = $_POST['email'];
	// $text = $_POST['text'];
	// $file = $_FILES['myfile'];

	//*Тело письма в виде таблицы
	foreach ( $_POST as $key => $value ) {
		if ( $value != "") {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
		}
	}
	$message = "<table style='width: 100%;'>$message</table>";

	$mail->Body = $message;

	//*Тело письма в виде текста
	// $mail->Body    = '
	// 	Пользователь оставил данные <br> 
	// Имя: ' . $name . ' <br>
	// Номер телефона: ' . $phone . '<br>
	// E-mail: ' . $email . '';

	//Отправляем
	if(!$mail->send()) {
		return false;
	} else {
		return true;
	}

	// if (!$mail->send()) {
	// 	$message = 'Ошибка';
	// } else {
	// 	$message = 'Данные отправлены!';
	// }

	// $response = ['message' => $message];

	// header('Content-type: application/json');
	// echo json_encode($response);
?>