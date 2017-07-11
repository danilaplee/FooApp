#INSTALL UBUNTU
FROM ubuntu:16.04

#INSTAL NODEJS
RUN apt-get update && apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN apt-get update && apt-get install -y npm

#INSTALL POSTGRESQL
RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN apt-get update && apt-get install -y python-software-properties software-properties-common postgresql-9.6 postgresql-client-9.6 postgresql-contrib-9.6

#ENABLE POSTGRESQL
USER postgres
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.6/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/9.6/main/postgresql.conf
RUN service postgresql start && psql -c "create database foo;" && psql -c "create role foo with login password 'foobar'; grant all privileges on database foo to foo;"
CMD service postgresql start && node server.js

# EXPOSE 5432

#ENABLE WEB APP
RUN cd /opt/
RUN git clone https://github.com/danilaplee/FooApp.git foo
RUN cd foo && npm install
RUN npm start
EXPOSE 5050