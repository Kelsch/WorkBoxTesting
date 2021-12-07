# WorkBoxTesting
WorkBoxTesting

design32

https://stackoverflow.com/questions/27294589/creating-self-signed-certificate-for-domain-and-subdomains-neterr-cert-commo

//This is what I used to create a working test certificate, it only works on localhost though. It outputs a .crt file that can be installed, then renamed to cert.pem

//Create a conf file using this

[req]
default_bits = 2048
default_keyfile = key.pem
encrypt_key = no
utf8 = yes
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = Cary
L = Cary
O  = BigCompany
CN = localhost

[v3_req]
keyUsage = critical, digitalSignature, keyAgreement
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = localhost:8181
DNS.3 = *.localhost:8181

//Then run this

openssl req -x509 -sha256 -nodes -days 3650 -newkey rsa:2048 -keyout key.pem -out app.crt -config openssl.conf