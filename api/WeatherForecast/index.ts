import { AzureFunction, Context, HttpRequest } from "@azure/functions"

interface WeatherForecastData {
    Date: Date,
    TemperatureC: number,
    TemperatureF: number,
    Summary: string
}

const getSummary = (temp: number):string => {
    var summary = "Mild"

    if (temp >= 32)
    {
        summary = "Hot"
    }
    else if (temp <= 16 && temp > 0)
    {
        summary = "Cold"
    }
    else if (temp <= 0)
    {
        summary = "Freezing"
    }

    return summary
}

const getRandomTemperature = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const WeatherForecast: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    let now = new Date()
    
    let result = Array(5).fill(0).map((_, idx) => {
        let temp = getRandomTemperature(-20, 55)
        return {
            Date: new Date(now.setDate(now.getDate() + 1)),
            TemperatureC: temp,
            TemperatureF: 32 + Math.round(temp / 0.5556),
            Summary: getSummary(temp)
        } as WeatherForecastData
    })


    context.res = {
        body: result as [WeatherForecastData]
    }

}

export default WeatherForecast