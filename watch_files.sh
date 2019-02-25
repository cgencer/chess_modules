#!/bin/bash

watchdir=/home/piyon/o21x/web/modules/contrib/kingfish/
logfile=/home/piyon/o21x/web/modules/contrib/kingfish/log_filechanges.txt

while : ; do
	inotifywait $watchdir|while read path action file; do
                ts=$(date +"%C%y%m%d%H%M%S")
                if [[ $action =~ .*CLOSE_WRITE.* ]]
                then
                    	echo "$ts :: file: $file :: $action :: $path">>$logfile
                        runuser -l cg -c "cd $path;bower install"
                        chown -R nginx:nginx $path
                fi
        done
done
exit 0
