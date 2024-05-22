import { Request, Response } from "express"
import Asset from "../models/asset"


export const assetData = async (req:Request, res:Response) => {
    const symbol = req.params.symbol
    let finalData;
    try{
        const symbolData = await Asset.findOne({symbol, type: "data"})
        if(!symbolData || symbolData.date < Date.now()){
            const resp = await fetch(process.env.PREDICTION_URL+"/"+symbol, {method: "GET"})
            const data = await resp.json()
            if(!resp.ok || data.message){
                throw new Error(data.message || "Error while fetching asset data")
            }
            const asset = new Asset({
                type: "data",
                symbol,
                data: data.data,
                date: Date.now()+21600000
            })
            await Asset.findOneAndUpdate({symbol, type: "data"}, asset, {upsert: true})
            finalData = data.data
        }else{
            finalData = symbolData.data
        }
        return res.sendResponse({
            message: "Asset data fetched successfully",
            data: finalData,
        })
    }catch(error: any){
        res.sendResponse({
            message: error.message
        }, 500)
    }
}



export const assetPrediction = async (req:Request, res:Response) => {
    const symbol = req.params.symbol
    let finalData;
    try{
        const symbolData = await Asset.findOne({symbol, type: "prediction"})
        if(!symbolData || symbolData.date < Date.now()){
            const resp = await fetch(`${process.env.PREDICTION_URL}/${symbol}/predict`, {method: "GET"})
            const data = await resp.json()
            if(!resp.ok || data.message){
                throw new Error(data.message || "Error while fetching prediction data")
            }
            const asset = new Asset({
                type: "prediction",
                symbol,
                data: data.data,
                date: Date.now()+21600000
            })
            await Asset.findOneAndUpdate({symbol, type: "prediction"}, asset, {upsert: true})
            finalData = data.data
        }else{
            finalData = symbolData.data
        }
        return res.sendResponse({
            message: "Asset data fetched successfully",
            data: finalData,
        })
    }catch(error: any){
        res.sendResponse({
            message: error.message
        }, 500)
    }
}

