FROM python:3

RUN apt-get update
RUN apt-get install -y --no-install-recommends

EXPOSE 8088
EXPOSE 3306

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "./main.py" ]
