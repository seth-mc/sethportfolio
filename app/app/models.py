from django.db import models
import json


# Create your models here.
class DataLine(models.Model):
    name = models.CharField(max_length=10)
    dataPoints = models.CharField(max_length=2000)
    type ="line"
    axisYType = "secondary"
    showInLegend = True
    markerSize = 0
    yValueFormatString = "##0.00\"%\""
    color = models.CharField(max_length=20, default="#D0D0D0", unique=True)

    def as_dict(self):
        data = json.loads(self.dataPoints)
        x = {
            "type": self.type,
            "axisYType": self.axisYType,
            "name": self.name,
            "markerSize": self.markerSize,
            "yValueFormatString": self.yValueFormatString,
            "showInLegend": self.showInLegend,
            "dataPoints": data,    
            "color": self.color,
        }
        return x
    