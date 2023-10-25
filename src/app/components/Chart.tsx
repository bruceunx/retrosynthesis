import { Flex } from '@radix-ui/themes'
import ReactFlow, {
  Background,
  useEdgesState,
  useNodesState,
  MarkerType,
  Node,
} from 'reactflow'
import 'reactflow/dist/style.css'

import ReactionNode from './ReactionNode'
import ChemNode from './ChemNode'
import { useCallback, MouseEvent } from 'react'

import { initialNodes, initialEdges } from '../data'

const nodeTypes = {
  chemNode: ChemNode,
  reactionNode: ReactionNode,
}

const defaultEdgeOptions = {
  style: { strokeWidth: 1, stroke: 'lightgreen' },
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'lightgreen',
  },
}

export default function Chart({
  handleSelect,
}: {
  handleSelect: (node: Node) => void
}) {
  const [nodes, ___, onNodesChange] = useNodesState(initialNodes)
  const [edges, _, __] = useEdgesState(initialEdges)

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      handleSelect(node)
    },
    [handleSelect],
  )

  return (
    <Flex className='w-full h-full'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        defaultEdgeOptions={defaultEdgeOptions}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Background />
      </ReactFlow>
    </Flex>
  )
}
