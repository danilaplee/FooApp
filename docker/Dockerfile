#INSTALL UBUNTU
FROM google/nodejs

#INSTAL NODEJS
RUN apt-get update && apt-get -y install curl

#ENABLE WEB APP
RUN git clone https://github.com/danilaplee/FooApp.git .
# ADD ../ /app
RUN cd /app
RUN npm install
RUN ls -a /app

#INSTALL POSTGRESQL 9.4
RUN apt-get install -y postgresql


#ENABLE POSTGRESQL
USER postgres
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.4/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/9.4/main/postgresql.conf
RUN service postgresql start && psql -c "create database foo;" && psql -c "create role foo with login password 'foobar'; grant all privileges on database foo to foo;"
CMD service postgresql start && node server.js
EXPOSE 5432

#RUN WEB APP
RUN npm start
EXPOSE 5050