export type ChemNodeData = {
  isTarget?: boolean | undefined
  isLeaf?: boolean | undefined
  imgUrl: string
}

export type ReactNodeData = {
  condition: string
}


export type NodeProps = {
	imgUrl : string
	isExpand: boolean
}

export type RouteProps = {
	serial : string
	isExpand: boolean
}



// export type ChemData = {
//   id: string
//   type: string
//   position: {
//     x: number
//     y: number
//   }
//   data: ChemData
// }