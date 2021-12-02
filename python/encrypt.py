import sys
import getopt
import os

# Cryptodome docs: https://www.pycryptodome.org/en/latest/index.html
# Package: https://pypi.org/project/pycryptodomex/
from Cryptodome.Cipher import AES
from Cryptodome.Random import get_random_bytes


def main():
    opts, args = get_args()

    for o, a in opts:
        if o in ("-h", "--help"):
            usage()
            break
        elif o in ("-e", "--encrypt"):
            encrypt(args)
            break
        elif o in ("-d", "--decrypt"):
            decrypt(args)
            break
        elif o in ("-g", "--gen-key"):
            gen_key(args)
            break
    else:
        # If for loop isn't broken above, then
        # bad arg was passed in. Just show usage in this case.
        usage()


def get_files_from_args(args, amount, ignore_checks=False):
    """Gets files from args passed in by user to the script.

    Parameters:
        args (list): All args passed in to script.
        amount (int): Amount of files that should be in the args and to return.
        ignore_checks (bool): If should ignore checks, you should manually add your own checks
                              in if enabled to avoid errors.

    Returns:
        fpaths (list): List of all file paths fetched.
    """

    fpaths = args[0:amount]

    if not ignore_checks:
        # If length of fpaths does not equal the amount of files wanted
        if len(fpaths) != amount:
            print(
                f"Not enough or too many files passed in. Expected {amount} files, but recieved {len(fpaths)}."
            )

        # If not files passed in, exit.
        if not fpaths:
            print("No files passed in, use -h switch for more info on usage.")
            sys.exit(1)

        nonexistent_files = []
        for path in fpaths:
            # https://docs.python.org/3/library/os.path.html#os.path.isfile
            if not path or not os.path.isfile(path):
                nonexistent_files.append(path)

        if nonexistent_files:
            if len(nonexistent_files) <= 1:
                print(f"File '{nonexistent_files[0]}' does not exist.")
            else:
                print(
                    f"""Files '{"', '".join(nonexistent_files)}' do not exist.""")

            sys.exit(1)

    return fpaths


def gen_key(args):
    """Generate a new 256 bit key to be used to encrypt/decrypt files using AES.

    Parameters:
        args (list): All args passed in to script.
    """

    print("Generating key...")

    key = get_random_bytes(32)

    out_file_path = get_files_from_args(args, 1, True)

    if len(out_file_path) == 1:
        out_file_path = out_file_path[0]
    else:
        out_file_path = "secret.key"

    file_out = open(out_file_path, "wb")
    file_out.write(key)
    file_out.close()

    print("Key generated in file:", out_file_path)


def encrypt(args):
    # 0 - File to encrypt
    # 1 - Key to use for encryption
    files_in = get_files_from_args(args, 2)

    # Read data to encrypt from file
    file_in = open(files_in[0], "rb")
    to_enc = file_in.read()
    file_in.close()

    # Read key from file
    key_file_in = open(files_in[1], "rb")
    key = key_file_in.read()
    key_file_in.close()

    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(to_enc)

    # https://docs.python.org/3/library/os.path.html#os.path.splitext
    file_in_name, file_in_ext = os.path.splitext(files_in[0])
    file_out = open(f"{file_in_name}_encrypted{file_in_ext}", "wb")
    [file_out.write(x) for x in (cipher.nonce, tag, ciphertext)]
    file_out.close()


def decrypt(args):
    # First path (0) in list will be the file to decrypt,
    # second (1) will be path to key file to use for decrypting
    in_files = get_files_from_args(args, 2)

    key_file_in = open(in_files[1], "rb")
    key = key_file_in.read()
    key_file_in.close()

    enc_file_in = open(in_files[0], "rb")
    nonce, tag, ciphertext = [enc_file_in.read(x) for x in (16, 16, -1)]

    try:
        cipher = AES.new(key, AES.MODE_EAX, nonce)
        data = cipher.decrypt_and_verify(ciphertext, tag)

        enc_file_in_name, enc_file_in_ext = os.path.splitext(in_files[0])
        file_out = open(
            # Remove Suffix: https://docs.python.org/3/library/stdtypes.html#str.removesuffix
            f"{enc_file_in_name.removesuffix('_encrypted')}_decrypted{enc_file_in_ext}",
            "wb"
        )
        file_out.write(data)
        file_out.close()
    except ValueError as err:
        print(err)

        if 'mac check failed' in str(err).lower():
            print("Double check the file and key you are passing in")
    except Exception as err:
        print(err)


def get_args():
    """Get command line arguments passed in."""

    # https://docs.python.org/3/library/getopt.html
    try:
        opts, args = getopt.getopt(
            sys.argv[1:],
            'hedg',
            ['help', 'encrypt', 'decrypt', 'gen-key']
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
    print("""Usage: python3 encrypt.py [option] [args]

OPTIONS

    -h, --help          Shows this message then quits.

    -g, --gen-key       Generate a key, which can be used for encrypting/decrypting your files.
                        Optionally supply a key out file as an argument.

    -e, --encrypt       Encrypt data.

    -d, --decrypt       Decrypt data.

EXAMPLES
    
    python3 encrypt.py -g ./out.key
        Generate a key that can be used to encrypt and decrypt your files
        and output it to the out.key file.

    python3 encrypt.py -e ./file-to-encrypt.txt ./secret.key
        Encrypt the contents of file-to-encrypt.txt using key inside the 
        secret.key file.
        
    python3 encrypt.py -d ./file-to-decrypt.txt ./secret.key
        Decrypt file-to-decrypt.txt using the same key that was used to 
        encrypt it.""")
    sys.exit(0)


if __name__ == "__main__":
    main()
