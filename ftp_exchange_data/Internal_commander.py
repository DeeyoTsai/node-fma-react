import ftplib
import time
import os
import json
import uuid
import logging

# 設定 logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("commander.log"),  # 寫入檔案
        logging.StreamHandler()  # 也輸出到終端機
    ]
)

# FTP 伺服器設定
FTP_HOST = '你的FTP伺服器IP或網址'
FTP_USER = '你的FTP使用者名稱'
FTP_PASS = '你的FTP密碼'
COMMAND_DIR = '/commands/'
RESULT_DIR = '/results/'

def send_command_and_wait_for_result(script_name):
    """
    建立指令檔案，上傳到 FTP，並等待結果檔案。
    """
    command_id = str(uuid.uuid4())
    command_filename = f'command_{command_id}.json'
    
    command_data = {
        'script_name': script_name,
        'command_id': command_id
    }

    # 寫入指令檔案
    with open(command_filename, 'w') as f:
        json.dump(command_data, f)
    
    try:
        logging.info("嘗試上傳指令檔案...")
        with ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS) as ftp:
            with open(command_filename, 'rb') as f:
                ftp.storbinary(f'STOR {COMMAND_DIR}{command_filename}', f)
        logging.info(f"指令檔案 {command_filename} 已成功上傳。")
        os.remove(command_filename)
        
        # 等待結果
        result_filename = f'result_{command_id}.json'
        logging.info("等待執行結果...")
        while True:
            with ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS) as ftp:
                ftp.cwd(RESULT_DIR)
                if result_filename in ftp.nlst():
                    logging.info("發現結果檔案，正在下載...")
                    
                    with open(result_filename, 'wb') as f:
                        ftp.retrbinary(f'RETR {result_filename}', f.write)
                    
                    # 刪除 FTP 上的結果檔案
                    ftp.delete(result_filename)
                    break
            
            time.sleep(5)
        
        # 讀取並處理結果
        with open(result_filename, 'r') as f:
            result_data = json.load(f)
        
        os.remove(result_filename)
        return result_data

    except ftplib.all_errors as e:
        logging.error(f"FTP 錯誤: {e}")
        return None
    except Exception as e:
        logging.critical(f"發生嚴重錯誤: {e}")
        return None

if __name__ == '__main__':
    script_to_run = 'my_script.py'
    result = send_command_and_wait_for_result(script_to_run)
    
    if result:
        logging.info("\n--- 執行結果 ---")
        if result['status'] == 'success':
            logging.info("狀態: 成功")
            logging.info(f"輸出:\n{result['output']}")
        else:
            logging.warning("狀態: 錯誤")
            logging.warning(f"訊息:\n{result['error']}")