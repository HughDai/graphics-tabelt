#!/bin/bash
jump_hosts="45.77.23.183"
ssh root@$jump_hosts "sudo sh drawing.sh"
echo "\033[47;34m deployment was successfully executed \033[0m"