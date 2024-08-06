import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong_project.settings')
django.setup()

def main():
    print("Contract deployment should be done manually through Remix IDE.")
    print("After deployment, update the CONTRACT_ADDRESS in the .env file.")

if __name__ == "__main__":
    main()