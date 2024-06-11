interface UserInterface {
  _id: string
  name?: string
  email?: string
  password?: string
  AUTH_TOKEN?: string
  verified?: Boolean
  createdAt?: string | Date
  admin?: Boolean
  subscription?: {
    subscribed?: Boolean
    order_data?: null | {
      id?: string
      amount?: string
      receipt?: string
      created_at?: string | Date
      plan: string
    }
    plan?: string | null
    token?: string | null
    freetrial_taken?: Boolean
    expire?: string
  }
  promo?: {
    screens?: { title: string, caption: string, screenshot: string, screenshot_url: string, screenshot2?: string, screenshot_url2?: string }[]
    logo?: string
    logo_url?: string
    main_screenshot?: string
    main_screenshot_url?: string
    appname?: string
    description?: string
    audio?: string
    audio_url?: string
    template?: string
    download_path?: string
    created?: Boolean,
    appstore_icon?: Boolean,
    playstore_icon?: Boolean,
  }
}

export default UserInterface
