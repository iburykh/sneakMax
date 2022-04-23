<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	// use PHPMailer\PHPMailer\SMTP; // если используются настройки SMTP

	require 'phpmailer/Exception.php';
	require 'phpmailer/PHPMailer.php';
	// require 'phpmailer/src/SMTP.php'; // если используются настройки SMTP

	//* Переменные, которые отправляет пользователь (можно вставлять в тело письма)
	// $name = $_POST['name'];
	// $email = $_POST['email'];
	// $text = $_POST['text'];
	// $file = $_FILES['myfile'];
	$file = $_FILES['file']; //*для файлов

	//* Формирование самого письма
	$title = "Тема письма";
	$c = true;

	//Тело письма в виде таблицы
	foreach ( $_POST as $key => $value ) {
		if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
			$body .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
		}
	}
	  
	$body = "<table style='width: 100%;'>$body</table>";

	// Тело письма в виде текста
	// $body = "
	// 	<h2>Новое письмо</h2>
	// 	<b>Имя:</b> $name<br>
	// 	<b>Почта:</b> $email<br><br>
	// 	<b>Сообщение:</b><br>$text
	// ";

	// Настройки PHPMailer
	$mail = new PHPMailer(true);
	$mail->CharSet = "UTF-8";

	//* Эту часть не используем для OpenServer (там свои настройки smtp)
	// $mail->isSMTP();  
	// $mail->SMTPAuth   = true;                                           
	// $mail->Host       = 'smtp.mail.ru'; // SMTP сервера вашей почты                   
	// $mail->Username   = 'diva84@mail.ru'; // Логин на почте
	// $mail->Password   = 'mHemYMbRarAdexagrpZZ'; // Пароль на почте
	// $mail->SMTPSecure = 'TLS'; 	           						
	// $mail->Port       = 587;  

	// Адрес самой почты и имя отправителя (!обязательно указывать почту как в настройках SMTP!)
	$mail->setFrom('iburih@gmail.com', 'Заявка с вашего сайта');
	// Получатель письма
	$mail->addAddress('diva84@mail.ru');
	// $mail->addAddress('iburih@gmail.com'); // Ещё один, если нужен

	// Прикрипление файлов к письму
	if (!empty($file['name'][0])) {
	  for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
		$uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
		$filename = $file['name'][$ct];
		if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
			$mail->addAttachment($uploadfile, $filename);
			$rfile[] = "Файл $filename прикреплён";
		} else {
			$rfile[] = "Не удалось прикрепить файл $filename";
		}
	  }
	}

	// Отправка сообщения
	$mail->isHTML(true);
	$mail->Subject = $title;
	$mail->Body = $body;

	if (!$mail->send()) {
		$message = 'Ошибка';
	} else {
		$message = 'Данные отправлены!';
	}
  
	//* Отображение результата
	// с файлом
	// echo json_encode(["result" => $result, "resultfile" => $rfile, "message" => $message]);

	// без файла
	echo json_encode(["result" => $result, "message" => $message]);
?>