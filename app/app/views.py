from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse
from .models import DataLine
from django.contrib.staticfiles.storage import staticfiles_storage
from django.http import JsonResponse
import yfinance as yf
from datetime import datetime
import numpy as np
import json
import pandas as pd
import time
import random
import re


colors = ['#feb4e7', '#b28dff', '#ddd4ff', '#adf8d7', '#befdc4', '#fec9dd', '#fe9aee', '#c6a3ff', '#a69afe', '#c5fcf9', '#d9fed3', '#ffabab', '#fdc9f7', '#d6aaff', '#c5fcf9', '#daffd4', '#ffabab', '#fecaf8', '#d6aaff', '#85e3ff', '#f1fee2', '#ffbebc', '#fcc0fe', '#edd4fe', '#96a0ff', '#aee8fe', '#e7ffa9', '#ffcac0', '#f6a6ff', '#fbe4ff', '#aec9ff', '#6eb6ff', '#ffffd1', '#fef5bd']
def colorpicker():  
    try:
        a = colors[0]
        colors.remove(a)
    except IndexError:
        a = random.choice(['#feb4e7', '#b28dff', '#ddd4ff', '#adf8d7', '#befdc4', '#fec9dd', '#fe9aee', '#c6a3ff', '#a69afe', '#c5fcf9', '#d9fed3', '#ffabab', '#fdc9f7', '#d6aaff', '#c5fcf9', '#daffd4', '#ffabab', '#fecaf8', '#d6aaff', '#85e3ff', '#f1fee2', '#ffbebc', '#fcc0fe', '#edd4fe', '#96a0ff', '#aee8fe', '#e7ffa9', '#ffcac0', '#f6a6ff', '#fbe4ff', '#aec9ff', '#6eb6ff', '#ffffd1', '#fef5bd'])
    return str(a)

# Create your views here.
def index(request):
    return render(request, 'index.html')


def getData(request):
    if request.method == 'GET':

        print("1. Making API Request...\n")

        try:
            with open(staticfiles_storage.path('vendor/data/mytickers.json'), "r") as fh:
                tdata = json.load(fh)
                tickers = []
                for i in range(len(tdata)):
                    tickers.append(tdata[i]['ticker'])
                    
        except FileNotFoundError:
                print("Tickers not found... entering in placeholders")
                tickers = ["^GSPC","AAPL","BRK-B","AMZN","SHOP","CRWD","ZS","NET","S","BTC-CAD","ETH-CAD"]
        # gets data from yfinance
        today = datetime.today().strftime("%Y-%m-%d")
        pattern = re.compile('\w{2,4}-CAD')
        crypto = re.findall(pattern, str(tickers))
        stocks = list(set(tickers) ^ set(crypto))
        try:
            cdf = yf.download(" ".join(crypto), start="2017-12-01", end=today)
            time.sleep(1)
            sdf = yf.download(" ".join(stocks), start="2017-12-01", end=today)
            cdf, sdf = cdf['Adj Close'].fillna(value=0), sdf['Adj Close'].fillna(value=0)
        # if not, pulls static file up to show something
        except Exception as e:
            print(str(e) + ": API Timeout occured?")
            try: 
                with open(staticfiles_storage.path('vendor/data/cryptodata.txt'), "r") as fh:
                    cdf = pd.read_csv(fh)
                    cdf['Date'] = pd.to_datetime(cdf['Date'])
                    cdf = cdf.set_index('Date')
                with open(staticfiles_storage.path('vendor/data/stockdata.txt'), "r") as fh:
                    sdf = pd.read_csv(fh)
                    sdf['Date'] = pd.to_datetime(sdf['Date'])
                    sdf = sdf.set_index('Date')
                print("read data from server, couldn't connect to API.")
            except FileNotFoundError:
                print("cannot find static files. ")
                pass

        print("2. Updating Price Banner...\n")

        btickers = tickers.copy()
        btickers.remove('^GSPC')
        prices = pd.concat([cdf, sdf], axis=1, join='inner')
        for ticker in btickers:
            prices.insert((prices.columns.get_loc(ticker) + 1), (ticker + " Pct. Change"), prices[ticker].pct_change())
        prices = prices.iloc[-1]
        date = prices.name.strftime("%b %d, %Y")
        prices = prices.to_dict()
        stockbanner = []
        # stock price banner
        for ticker in btickers:
            price = '{:.2f}'.format(prices[ticker])
            change = prices[f"{ticker} Pct. Change"]
            formattted = '%.2f' % round(abs(change) * 100, 2)
            mvmt = lambda x: "▼" if x < 0 else "▲"
            stockbanner.append(f"{ticker}: ${price}  {formattted}% {mvmt(change)}")

        print("3. Creating Stock Graph... \n")

        pattern = re.compile('\w{2,4}-CAD') # what a crypto ticker looks like
        crypto = re.findall(pattern, str(tickers))
        stocks = list(set(tickers) ^ set(crypto))
        bsdf = sdf.pct_change(periods=30)[30:].fillna(value=0)
        bsdf.replace([np.inf, -np.inf], 0, inplace=True)
        sdatalines = []
        for stock in stocks: # for each stock, create its dataform
            line = []
            data = bsdf[stock].to_dict()
            for key, value in data.items():
                d = {}
                a = key.strftime("%Y-%m-%d")
                b = float(value * 100.000)
                d["x"] = a
                d["y"] = b
                line.append(d)   
            line = re.sub("'", '"', str(line)) # gets rid of the 's that appeared in string concatenation            
            if stock is not None:
                if '^GSPC' in stock:
                    sdatalines.append(DataLine(
                                                name = stock, 
                                                dataPoints = line))
                else:
                    sdatalines.append(DataLine(
                                                name = stock, 
                                                dataPoints = line, 
                                                color=colorpicker()))
            else:
                pass
        sdictionaries = [obj.as_dict() for obj in sdatalines]

        print("4. Creating Crypto Graph... \n")
        
        bcdf = cdf.pct_change(periods=15)[15:].fillna(value=0)
        bcdf.replace([np.inf, -np.inf], 0, inplace=True)
        cdatalines = []
        for c in crypto: # for each crypto, create its dataform
            line = []
            data = bcdf[c].to_dict()
            for key, value in data.items():
                d = {}
                a = key.strftime("%Y-%m-%d")
                b = float(value * 100.000)
                d["x"] = a
                d["y"] = b
                line.append(d)   
            line = re.sub("'", '"', str(line)) # gets rid of the 's that appeared in string concatenation            
            if c is not None:
                if 'BTC' in c:
                    cdatalines.append(DataLine(
                                                name = c, 
                                                dataPoints = line))
                else:
                    cdatalines.append(DataLine(
                                                name = c, 
                                                dataPoints = line, 
                                                color=colorpicker()))
            else:
                pass
        cdictionaries = [obj.as_dict() for obj in cdatalines]
        return HttpResponse(json.dumps({"FinanceData": date, "stockGraph": sdictionaries, "cryptoGraph": cdictionaries, "priceBanner":  date + ": " + " ---- ".join(stockbanner)}))
