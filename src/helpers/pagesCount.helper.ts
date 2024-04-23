export const calcutePages = (limit: number, total:number) => {
   return total > 0 ? Math.ceil(total / limit) : 1
}