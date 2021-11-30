import sys
import getopt

# Cryptodome docs: https://www.pycryptodome.org/en/latest/index.html
# Package: https://pypi.org/project/pycryptodomex/
from Cryptodome.Cipher import AES
from Cryptodome.Random import get_random_bytes


def main():
    opts, args = get_args()

    for o, a in opts:
        if o in ("-h", "--help"):
            usage()
        elif o in ("-e", "--encrypt"):
            encrypt(args)
            break
        elif o in ("-d", "--decrypt"):
            decrypt(args)
            break
    else:
        # If for loop isn't broken above, then
        # bad arg was passed in. Just show usage in this case.
        usage()


def encrypt(args):
    key = get_random_bytes(16)

    file_out = open("key.pem", "wb")
    file_out.write(key)
    file_out.close()

    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(bytes("hi", 'utf-8'))

    file_out = open("encrypted.bin", "wb")
    [file_out.write(x) for x in (cipher.nonce, tag, ciphertext)]
    file_out.close()


def decrypt(args):
    key_file_in = open("key.pem", "rb")
    # key = key_file_in.read()
    key = "aiskdofkksidksid"
    key_file_in.close()

    enc_file_in = open("encrypted.bin", "rb")
    nonce, tag, ciphertext = [enc_file_in.read(x) for x in (16, 16, -1)]

    try:
        cipher = AES.new(key, AES.MODE_EAX, nonce)
        data = cipher.decrypt_and_verify(ciphertext, tag)
        file_out = open("decrypted.bin", "wb")
        file_out.write(data)
        file_out.close()
    except ValueError as err:
        print(err)
    except Exception as err:
        print(err)


def get_args():
    """Get command line arguments passed in."""

    # https://docs.python.org/3/library/getopt.html
    try:
        opts, args = getopt.getopt(
            sys.argv[1:],
            'hed',
            ['help', 'encrypt', 'decrypt']
        )
    except getopt.GetoptError as err:
        # Print help information and exit:
        print(err)  # Will print something like "option -a not recognized"
        usage()

    # Show usage if no args are passed
    if not opts and not args:
        usage()

    return (opts, args)


def usage():
    print("""Usage: python encrypt.py [-h] [-e | -d] [data to encrypt]

    -h, --help      Shows this message then quits.

    -e, --encrypt   Encrypt data.

    -d, --decrypt   Decrypt data.""")
    sys.exit(2)


if __name__ == "__main__":
    main()
