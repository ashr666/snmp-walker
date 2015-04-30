## xway net monitor
### SNMP and RMON diagnose API

To install snmp server in debian :
[ Ref here: http://www.satsignal.eu/raspberry-pi/monitoring.html ]

To use snmp client as reference in debian:
[ https://wiki.debian.org/SNMP ]

```bash
sudo apt-get update
sudo apt-get install snmpd 
```

Then sudo `nano /etc/snmp/snmpd.conf` to bind to any address, not only localhost, so you can listen from outside your machine.

Comment `agentAddress udp:127.0.0.1:161` and uncomment the following:

```
agentAddress udp:161,udp6:[::1]:161
```

By @_jesusdario as a project for net managing subject at the University of Sevilla.