# Exercise 3.02: Back to Ingress

It eventually works, but apparently has some bug, as it takes a long time to start properly.

```
v901-103:manifests rvl$ date
Sat Jul 16 12:43:38 EEST 2022
v901-103:manifests rvl$ curl http://34.102.194.66/pingpong
pong 11v901-103:manifests rvl$ curl http://34.102.194.66/pingpong
pong 12v901-103:manifests rvl$ curl http://34.102.194.66/
Hello
2022-07-16 09:43:59.174079+00:00 28e3014f69ad7f0bc39ea49bec5fd52e.
Ping / Pongs: 12v901-103:manifests rvl$ 
v901-103:manifests rvl$ curl http://34.102.194.66/
Hello
2022-07-16 09:44:04.173210+00:00 28e3014f69ad7f0bc39ea49bec5fd52e.
Ping / Pongs: 12v901-103:manifests rvl$ 
```

[Possible logs](e302.txt)