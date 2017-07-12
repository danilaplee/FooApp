#INSTALL NODEJS ENABLED BUILD
FROM google/nodejs

#INSTAL NODEJS
RUN apt-get update && apt-get -y install curl

#ENABLE WEB APP
RUN git clone https://github.com/danilaplee/FooApp.git .
RUN cd /app
RUN npm install
RUN ls -a /app

#INSTALL POSTGRESQL 9.4
RUN apt-get install -y postgresql

#ENABLE POSTGRESQL
USER postgres
RUN echo "host all  all    127.0.0.1/0  md5" >> /etc/postgresql/9.4/main/pg_hba.conf
RUN echo "listen_addresses = '*'" >> /etc/postgresql/9.4/main/postgresql.conf
RUN echo "unix_socket_directories = '/var/run/postgresql'" >> /etc/postgresql/9.4/main/postgresql.conf
RUN service postgresql start && psql -c "create database foo;" && psql -c "create role foo with login password 'foobar'; grant all privileges on database foo to foo;"
RUN service postgresql restart
EXPOSE 5432

#RUN WEB APP
USER root
RUN npm start
EXPOSE 5050