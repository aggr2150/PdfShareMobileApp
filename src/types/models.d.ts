declare interface TPlace {
  _id: string;
  author: {
    userId: string;
    maskedPhone: string;
  };
  category: string;
  title: string;
  content: string;
  images: TImage[];
  location: {
    longitude: number;
    latitude: number;
  };
  link?: string;
  postcode: any;
  parkingInformation?: string;
  phoneNumber: string;
  likeStatus: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

declare interface ISession {
  userId?: string;
  id?: string;
  nickname?: string;
  email?: string;
}
