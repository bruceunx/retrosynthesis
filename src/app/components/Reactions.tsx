import React, { useCallback, useState } from 'react'
import { Flex, Heading, RadioGroup } from '@radix-ui/themes'
import Reaction from './Reaction'
import { useReactFlow } from 'reactflow'
import { getChemicalSVG } from '../utils/api'

let id = 1

const Reactions: React.FC<any> = ({ routes, currentNode }) => {
  let idx = 0
  const [tempNodes, setTempNodes] = useState<any[]>([])
  const [tempEdges, setTempEdges] = useState<any[]>([])

  const { addEdges, addNodes, setEdges, setNodes, fitView } = useReactFlow()

  const generateNode = async (smiles: string, idx: number) => {
    const svg = await getChemicalSVG(smiles)
    if (svg === null) {
      return null
    } else {
      const svgUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`

      let _id = `chemNode_${id++}`
      idx++
      return {
        id: _id,
        type: 'chemNode',
        data: { imgUrl: svgUrl, isLeaf: true },
        position: {
          x: currentNode.position.x - 400,
          y: currentNode.position.y - 200 + idx * 100,
        },
      }
    }
  }

  const generateEdge = (chemNode: any, reactionNode: any) => {
    let _id = `e${chemNode.id}-${reactionNode.id}`
    return {
      id: _id,
      source: `${chemNode.id}`,
      target: `${reactionNode.id}`,
      type: 'smoothstep',
    }
  }

  const onChange = useCallback(
    async (value: string) => {
      // setCurrentNode(null)
      // eslint-disable-next-line
      idx = 0

      if (tempNodes.length > 0) {
        setNodes((nodes) =>
          nodes.filter((node) => !tempNodes.includes(node.id)),
        )
      }
      if (tempEdges.length > 0) {
        setEdges((edges) =>
          edges.filter((edge) => !tempEdges.includes(edge.id)),
        )
      }

      setTempNodes([])
      setTempEdges([])

      const route = routes[parseInt(value) - 1]
      const reactants = route.smiles_split

      let newChemNodes = []

      for (let i = 0; i < reactants.length; i++) {
        let node = await generateNode(reactants[i], i)
        if (node !== null) {
          newChemNodes.push(node)
        }
      }

      let newReactionNode = {
        id: `reactionNode_${id++}`,
        type: 'reactionNode',
        data: { condition: '#2' },
        position: {
          x: currentNode.position.x - 120,
          y: currentNode.position.y + 24,
        },
      }

      let newEdges = newChemNodes.map((chemNode: any) =>
        generateEdge(chemNode, newReactionNode),
      )
      newEdges.push({
        id: `e${newReactionNode.id}-${currentNode.id}`,
        source: newReactionNode.id,
        target: currentNode.id,
        type: 'smoothstep',
      })

      newChemNodes.push(newReactionNode)
      setTempNodes(newChemNodes.map((node) => node.id))
      setTempEdges(newEdges.map((edge) => edge.id))

      addNodes(newChemNodes)
      addEdges(newEdges)

      function sleep(milliseconds: number) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds))
      }
      await sleep(2000)

      fitView()
    },
    //eslint-disable-next-line
    [
      addEdges,
      addNodes,
      generateNode,
      generateEdge,
      setEdges,
      setNodes,
      setTempEdges,
      setTempNodes,
    ],
  )
  return (
    <RadioGroup.Root onValueChange={onChange}>
      <Flex direction='column' width='100%' gap='4'>
        <Flex
          className='w-full p-2'
          align='center'
          justify='center'
          direction='row'
          gap='8'
          style={{ backgroundColor: 'var(--gray-a4)' }}
        >
          <Heading size='4'>路线编号</Heading>
          <Heading size='4'>设计可靠性</Heading>
          <Heading size='4' className='text-center w-[800px]'>
            反应路线
          </Heading>
          <Heading size='4'>是否选择</Heading>
        </Flex>
        {routes.map((route: any, idx: number) => (
          <Reaction route={route} target={currentNode.data.smiles} key={idx} />
        ))}
      </Flex>
    </RadioGroup.Root>
  )
}

export default Reactions
