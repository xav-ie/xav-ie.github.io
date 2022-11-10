
import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
	const { nodes, } = useGLTF("/heart.glb");
	return (
		<group {...props} dispose={null}>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Outline.geometry}
				material={nodes.Outline.material}
				position={[-0.02, 0.84, 0]}
				rotation={[1.57, 0, 0]}
				scale={168.43}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Board.geometry}
				material={nodes.Board.material}
				position={[0.01, 0.82, 0]}
				rotation={[1.57, 0, 0]}
				scale={168.43}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Inner.geometry}
				material={nodes.Inner.material}
				position={[0.01, 0.8, 0]}
				rotation={[1.57, 0, 0]}
				scale={168.43}
			/>
		</group>
	);
}

useGLTF.preload("/heart.glb");
