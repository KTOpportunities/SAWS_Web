import { AdvertDocument } from "./AdvertDocument";


export interface Advert {
    advertId: number
    advert_caption: string
    uploaded_by: string
    advert_url: string
    created_at: string
    updated_at: string
    isdeleted: boolean
    ispublished: boolean
    deleted_at: any
    DocAdverts: AdvertDocument[]
}
  
