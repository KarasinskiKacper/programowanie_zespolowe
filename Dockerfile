FROM python:3.12-slim 

EXPOSE 5000

WORKDIR /docker-test
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .

WORKDIR /docker-test/backend
CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0"] 
