#INSTALL NODEJS ENABLED BUILD
FROM google/nodejs

#UPDATE & INSTALL CURL
RUN apt-get update && apt-get -y install curl

#ENABLE WEB APP
RUN cd /app
RUN git clone https://github.com/danilaplee/FooApp.git .
RUN npm install
RUN ls -a /app

#OPEN PORTS
# EXPOSE 5432
EXPOSE 5050

#INSTALL POSTGRESQL 9.4

# # Add the PostgreSQL PGP key to verify their Debian packages.
# # It should be the same key as https://www.postgresql.org/media/keys/ACCC4CF8.asc
# RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8

# # Add PostgreSQL's repository. It contains the most recent stable release of PostgreSQL, ``9.6``.
# RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# # Install ``python-software-properties``, ``software-properties-common`` and PostgreSQL 9.6
# #  There are some warnings (in red) that show up during the build. You can hide
# #  them by prefixing each apt-get statement with DEBIAN_FRONTEND=noninteractive
# RUN apt-get update && apt-get install -y python-software-properties software-properties-common postgresql-9.6 postgresql-client-9.6 postgresql-contrib-9.6

# #ENABLE POSTGRESQL
# USER postgres
# RUN echo "host	all		all    	0.0.0.0/0  md5" >> /etc/postgresql/9.6/main/pg_hba.conf
# RUN echo "local	all 	all		trust" >> /etc/postgresql/9.6/main/pg_hba.conf
# RUN echo "listen_addresses = '*'" >> /etc/postgresql/9.6/main/postgresql.conf
# RUN echo "unix_socket_directories = '/var/run/postgresql'" >> /etc/postgresql/9.6/main/postgresql.conf
# RUN /etc/init.d/postgresql start 
# RUN ps -ef | grep postgres
# RUN psql -c "create database foo;" && psql -c "create role foo with login password 'foobar'; grant all privileges on database foo to foo;"
# RUN /etc/init.d/postgresql restart

# CMD ["postgresql"]
#RUN WEB APP
USER root
RUN npm start