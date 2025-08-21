import ftplib
import time
import os
import subprocess
import json
import logging

# 設定 logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("executor.log"),  # 寫入檔案
        logging.StreamHandler()  # 也輸出到終端機
    ]
)

# FTP 伺服器設定
FTP_HOST = '你的FTP伺服器IP或網址'
FTP_USER = '你的FTP使用者名稱'
FTP_PASS = '你的FTP密碼'
COMMAND_DIR = '/commands/'
RESULT_DIR = '/results/'

def check_and_execute():
    """
    連線到 FTP 伺服器，檢查是否有新指令檔案，並執行腳本。
    """
    try:
        logging.info("嘗試連線到 FTP 伺服器...")
        with ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS) as ftp:
            logging.info("成功連線到 FTP 伺服器。")
            ftp.cwd(COMMAND_DIR)
            command_files = ftp.nlst()
            
            if not command_files:
                logging.info("沒有發現新指令檔案。")
                return

            for filename in command_files:
                if filename.endswith('.json'):
                    logging.info(f"發現新指令檔案：{filename}")
                    
                    # 下載指令檔案
                    local_path = filename
                    with open(local_path, 'wb') as f:
                        ftp.retrbinary(f'RETR {filename}', f.write)
                    logging.info(f"指令檔案已下載到本地。")
                    
                    # 讀取並解析指令
                    with open(local_path, 'r') as f:
                        command_data = json.load(f)
                    
                    script_name = command_data.get('script_name')
                    logging.info(f"準備執行腳本：{script_name}")
                    
                    # 執行腳本並捕獲輸出
                    try:
                        result = subprocess.run(
                            ['python', script_name],
                            capture_output=True,
                            text=True,
                            check=True
                        )
                        status = 'success'
                        logging.info(f"腳本 {script_name} 執行成功。")
                        
                    except subprocess.CalledProcessError as e:
                        status = 'error'
                        logging.error(f"腳本 {script_name} 執行失敗。")
                        logging.error(f"標準輸出 (stdout):\n{e.stdout}")
                        logging.error(f"錯誤輸出 (stderr):\n{e.stderr}")
                        result = e
                    
                    # 準備結果數據
                    result_data = {
                        'status': status,
                        'output': result.stdout,
                        'error': result.stderr
                    }
                    
                    # 將結果寫入檔案並上傳
                    result_filename = f'result_{os.path.splitext(filename)[0]}.json'
                    with open(result_filename, 'w') as f:
                        json.dump(result_data, f)
                    
                    with open(result_filename, 'rb') as f:
                        ftp.storbinary(f'STOR {RESULT_DIR}{result_filename}', f)
                    
                    logging.info(f"執行結果已上傳：{result_filename}")
                    
                    # 刪除已處理的指令檔案
                    ftp.delete(filename)
                    os.remove(local_path)
                    os.remove(result_filename)
                    logging.info(f"指令檔案 {filename} 已處理並刪除。")
                    
    except ftplib.all_errors as e:
        logging.error(f"FTP 錯誤: {e}")
    except Exception as e:
        logging.critical(f"發生嚴重錯誤：{e}")

if __name__ == '__main__':
    logging.info("啟動 FTP 輪詢服務...")
    while True:
        check_and_execute()
        time.sleep(10)