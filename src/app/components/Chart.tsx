import { Button, Flex } from '@radix-ui/themes'
import ReactFlow, {
  Background,
  useEdgesState,
  useNodesState,
  MarkerType,
  Node,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

import ReactionNode from './ReactionNode'
import ChemNode from './ChemNode'
import { useCallback, MouseEvent } from 'react'


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
  const [nodes, _, onNodesChange] = useNodesState([])
  const [edges, __, onEdgesChange] = useEdgesState([])

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
        onEdgesChange={onEdgesChange}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Background gap={20} />
        <Panel position='top-right'>
          <Button variant='outline'>保存</Button>
          <Button variant='outline' color='indigo'>
            导出
          </Button>
        </Panel>
      </ReactFlow>
    </Flex>
  )
}
