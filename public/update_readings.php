<?php
	require("config.php");

	date_default_timezone_set("Asia/Kuala_Lumpur");

	$req_dump = print_r($_SERVER, TRUE);
	$fp = fopen('request.log', 'a');
	fwrite($fp, $req_dump);
	fclose($fp);
	
    function createNotification($conn, $type, $alarmMessage, $ruleid){
    	$sql = "INSERT INTO notification (timestamp, type, message, ruleid) VALUES ('" . time() . "','" . $type . "','" . $alarmMessage . "','" . $ruleid . "')";
    	$insert_sql = "INSERT INTO notification (timestamp, type, message, ruleid) VALUES (?,?,?,?)";
        try{
            $stmt_insert = $conn->prepare($insert_sql);
            $stmt_insert->execute(array(
                time(),
                $type,
                $alarmMessage,
                $ruleid
            ));
        } catch (PDOException $e) {
	    	echo "Error: " . $sql . "<br>" . $e->getMessage();
		}
    }

    function hasNoDuplicateNotification($conn, $ruleid){
		// true = no duplicate notification
		// false = similar notificaion has been created
        try{
            $sql_checkrule = "SELECT COUNT(*) FROM notification WHERE ruleid = ?";
            $stmt_check = $conn->prepare($sql_checkrule);
            $stmt_check->execute(array($ruleid));
            return $stmt_check->fetchColumn() == 0;
        } catch (PDOException $e) {
			echo "Error: " . $sql_checkrule . "<br>" . $e->getMessage();
            return null;
		}
    }

    function deleteNotification($conn, $ruleid){
        $sql_delete = "DELETE FROM notification WHERE ruleid = ?";
        $stmt_del = $conn->prepare($sql_delete);
        $stmt_del->execute(array($ruleid));
    }
	
	$post_content = file_get_contents('php://input');
	
    $outputArray = json_decode($post_content);
	//echo print_r($outputArray);
	if(count($outputArray) > 1){
		// is array
		$index = 1;
		foreach($jsonObj as $outputArray){
			echo "Processing " . $index . "<br>";
			processJSON($jsonObj, $index == count($outputArray));
			$index++;
		}
	}
	else{
		processJSON($outputArray, true);
	}
	
	$myFile = "office.txt";	
	file_put_contents($myFile, file_get_contents('php://input'));
	$conn = db_init2();
    $domain = $_SERVER ['REMOTE_ADDR'];
    //$sql2 = "INSERT INTO router (address) VALUES (:domain)";
    $sql2 = "UPDATE router set address = :domain";
    $stmt = $conn->prepare($sql2);
    $stmt->bindValue(":domain", $domain);
    $stmt->execute();
	
    function processJSON($outputArray, $is_last){
		// Create connection
		//$conn = db_init();
		$conn = db_init2();

		$logFile = "demo_error.txt";

		$timestamp = $outputArray->time;
		$totalactivepower = "";
		$temperature = "";
		$humidity = "";

		$energyconsumptionmeter = "000D6F0003E69466"; 
		$temphumiditymeter = "00124B0007306658"; //"00124B0002F63B46"; //"BC4B790300000043";
		$floodlight = "000D6F0000758953";
		$floodlighton = false;
        $motor = "000D6F00007588D6";
        $fridge = "000D6F0000758858";
        $aircond = "000D6F00007588E4";
        $aircond2 = "000D6F00036BCEBD";
        $energy_motor = 0;
        $energy_fridge = 0;
        $energy_aircond = 0;
        $energy_aircond2 = 0;
        $energy_floodlight = 0;
        

		foreach ($outputArray->devices as $device ) {
			if($device->mac == $energyconsumptionmeter){
				$totalactivepower = $device->totalactivepower;
			}
			elseif( $device->mac == $temphumiditymeter){
				$temperature = $device->temperature;
				$humidity = $device->humidity;
			}
			elseif( $device->mac == $floodlight){
				$floodlighton = $device->status == 1;
                $energy_floodlight = $device->activepower;
  
			}
            elseif( $device->mac == $motor){
                $energy_motor = $device->activepower;
  
			}
            elseif( $device->mac == $fridge){
                $energy_fridge = $device->activepower;
  
			}
            elseif( $device->mac == $aircond){
                $energy_aircond = $device->activepower;
  			}
            elseif( $device->mac == $aircond2){
                $energy_aircond2 = $device->activepower;
  			}
			
			// also push to another table
			if($device->model == "SG110-A" or $device->model == "SG110-OA"){
				$sql_temp = "INSERT INTO reading_temp (timestamp, deviceId, humidity, temperature) VALUES (FROM_UNIXTIME(:timestamp), :deviceId, :humidity, :temp)";
				$stmt = $conn->prepare($sql_temp);
				$stmt->bindValue(":timestamp", $timestamp);
				$stmt->bindValue(":deviceId", $device->mac);            
				$stmt->bindValue(":humidity", $device->humidity);
				$stmt->bindValue(":temp", $device->temperature);
				$stmt->execute();
			}
			// demo for spritzer
			else if($device->mac == "00124B00094E89B3"){
				$sql_t = "INSERT INTO reading_temperature (timestamp, device_id, temperature) VALUES (FROM_UNIXTIME(:timestamp), :deviceId, :temp)";
				//$sql_h = "INSERT INTO reading_humidity (timestamp, device_id, humidity) VALUES (FROM_UNIXTIME(:timestamp), :deviceId, :humidity)";
				try{
					$conn2 = new PDO("mysql:host=localhost;dbname=amsdb", "amsdbroot", "amsdb@1234");
					$conn2->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					$stmt = $conn2->prepare($sql_t);
					$stmt->bindValue(":timestamp", $timestamp);
					$stmt->bindValue(":deviceId", $device->mac);    
					$stmt->bindValue(":temp", $device->temperature);
					$stmt->execute();
					
					// no humidity reading
					/* $stmt = $conn2->prepare($sql_h);
					$stmt->bindValue(":timestamp", $timestamp);
					$stmt->bindValue(":deviceId", $device->mac);            
					$stmt->bindValue(":humidity", $device->humidity);
					$stmt->execute();
					 */
					
                    // publish in redis
                    require 'Predis/Autoloader.php';
                    Predis\Autoloader::register();

                    $client = new Predis\Client();
                    $client->executeRaw(['PUBLISH', $device->mac, $device->temperature]);
					
				} catch(PDOException $e) {
					echo 'ERROR: ' . $e->getMessage();
				}
			}
			
		}
		
            
		//$sql = "INSERT INTO readings (timestamp, humidity, temp, energy, energy_motor, energy_fridge, energy_floodlight, energy_aircond) VALUES ('". $timestamp ."', ".($humidity == '' ? "NULL" : "'$humidity'").", ".($temperature == '' ? "NULL" : "'$temperature'").", ".($totalactivepower == '' ? "NULL" : "'$totalactivepower'").")";
        
        $sql = "INSERT INTO readings (timestamp, humidity, temp, energy, energy_motor, energy_fridge, energy_floodlight, energy_aircond, energy_aircond2) VALUES (:timestamp, :humidity, :temp, :energy, :motor, :fridge, :floodlight, :aircond, :aircond2)";
        try{
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":timestamp", $timestamp);
            
            if($humidity == ''){
                $stmt->bindValue(":humidity", null, PDO::PARAM_INT);
            }
            else{
                $stmt->bindValue(":humidity", $humidity);
            }
            
            if($temperature == ''){
                $stmt->bindValue(":temp", null, PDO::PARAM_INT);
            }
            else{
                $stmt->bindValue(":temp", $temperature);
            }
            
            if($totalactivepower == ''){
                $stmt->bindValue(":energy", null, PDO::PARAM_INT);
            }
            else{
                $stmt->bindValue(":energy", $totalactivepower);
            }
            
            $stmt->bindValue(":motor", $energy_motor);
            $stmt->bindValue(":fridge", $energy_fridge);
            $stmt->bindValue(":floodlight", $energy_floodlight);
            $stmt->bindValue(":aircond", $energy_aircond);
            $stmt->bindValue(":aircond2", $energy_aircond2);
            $stmt->execute();

            echo "New record created successfully";            
            
        } catch (PDOException $e) {
            echo 'Fail to insert record: ' . $e->getMessage();
			file_put_contents($logFile, $timestamp . " Error: " . $sql . " - " . $e->getMessage() . "\n", FILE_APPEND);
		}

		if($is_last){
			// create notifications
			$maxconsumption = 3000;
			$benchmark = 1900;
			
			// Rule 1
			if($totalactivepower != ''){
				if($totalactivepower >= $maxconsumption * 0.9){
					if(hasNoDuplicateNotification($conn, 1)){
						createNotification($conn, "warning", "Energy consumption has reached 90%", 1);
					}
				}
				
				// Rule 2
				else if($totalactivepower >= $maxconsumption * 0.95){
					if(hasNoDuplicateNotification($conn, 2)){
						createNotification($conn, "error", "Energy consumption has reached 95%", 2);
					}
				}
				else{
					// consumption is normal
					deleteNotification($conn, 1);
					deleteNotification($conn, 2);
				}
			}


			// Rule 3
			if($temperature != ''){
				if($temperature < 22){
					if(hasNoDuplicateNotification($conn, 3)){
						createNotification($conn, "warning", "Temperature is low. Do you want to turn off air-cond?", 3);	
					}
				}
				else{
					deleteNotification($conn, 3);
				}
			}

			// Rule 4
			if($floodlighton){
				$currenthour = date('H');
				// is day time
				if($currenthour >= 7 and $currenthour < 19){
					// check if flood light on?
					if(hasNoDuplicateNotification($conn, 4)){
						createNotification($conn, "warning", "The flood light is on!", 4);
					}
				}
				// delete notification (if during night time)
				else{
					deleteNotification($conn, 4);	
				}
			}
			else{
				deleteNotification($conn, 4);
			}
		}

		// close connect after done
		$conn = null;
	}
?>