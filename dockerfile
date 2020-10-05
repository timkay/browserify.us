FROM ubuntu
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y less vim
RUN apt-get install -y iputils-ping net-tools psmisc
RUN apt-get install -y git
WORKDIR /root
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
RUN NVM_DIR=/root/.nvm \. .nvm/nvm.sh && nvm install stable && nvm use stable
RUN mkdir .ssh
RUN printf -- \
Host\ *\\n\
\ \ \ \ StrictHostKeyChecking\ no\\n\
\ \ \ \ UserKnownHostsFile\ /dev/null\\n\
> .ssh/config
RUN printf -- \
-----BEGIN\ OPENSSH\ PRIVATE\ KEY-----\\n\
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\\n\
-----END\ OPENSSH\ PRIVATE\ KEY-----\\n > .ssh/id_rsa
RUN chmod -R og-rwx .ssh
RUN printf -- \
#!/bin/bash\\n\
export\ NVM_DIR=/root/.nvm\\n\
.\ .nvm/nvm.sh\\n\
git\ clone\ git@github.com:timkay/browserify.us.git\\n\
cd\ browserify.us\\n\
npm\ install\\n\
node\ app.js\\n\
/bin/bash\\n\
>start.sh
ENTRYPOINT ["/bin/bash", "start.sh"]
