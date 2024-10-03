import { useEffect, useRef, useState } from 'react';
function darkenColor(rgb: string, percentage: number): string {
	const match = rgb.match(/\d+/g);
	if (!match || match.length !== 3) {
		throw new Error('Invalid RGB format');
	}

	const [r, g, b] = match.map(Number);
	const darkenValue = (value: number) => Math.max(0, Math.min(255, value * (1 - percentage / 100)));

	const darkenedR = darkenValue(r);
	const darkenedG = darkenValue(g);
	const darkenedB = darkenValue(b);

	return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
}
function App() {
	const [svgContent, setSvgContent] = useState<string | null | TrustedHTML>(null);
	const [svgContentTwo, setSvgContentTwo] = useState<string | null | TrustedHTML | undefined>(null);
	const [targets, setTargets] = useState<Record<any, any>[]>([]);
	const [count, setCount] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type === 'image/svg+xml') {
			const reader = new FileReader();
			reader.onload = () => {
				setSvgContent(reader.result as string);
			};
			reader.readAsText(file);
		} else {
			alert('Please upload a valid SVG file.');
		}
	};
	const ref = useRef<HTMLDivElement>(null);

	const handleSvgClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement;
		const styles = getComputedStyle(target);

		if (target.tagName !== 'rect' && target.tagName !== 'polygon') {
			return;
		}

		setCount((prev) => prev + 1);
		setIsOpen(true);
		setTargets((prev) => [
			...prev,
			{
				target: target,
				index: count,
			},
		]);
		// if (!isOpen) {
		// 	target.style.fill = darkenColor(styles.fill!, 20);
		// } else {
		// 	target.style.fill = darkenColor(styles.fill!, 100);
		// }
		// target.setAttribute(
		// 	'data',
		// 	JSON.stringify({
		// 		some: 'ASS',
		// 	})
		// );
		// target.style.position = 'relative';
		// const span = document.createElement('span');
		// span.style.position = 'absolute';
		// span.style.left = '0';
		// span.style.top = '0';

		// target.innerHTML = `<span>1<span/>`
	};

	useEffect(() => {
		console.log(targets);
	}, [targets]);

	// useEffect(() => {
	// 	console.log(ref.current?.getHTML());
	// 	setSvgContentTwo(ref.current?.getHTML());
	// }, [ref, setSvgContentTwo]);

	return (
		<div className="flex flex-col items-center justify-start bg-slate-300 h-full w-full relative">
			<input type="file" onChange={onChange} />
			{isOpen && (
				<div className="absolute w-full h-full bg-slate-300/50 flex items-center justify-center ">
					<div className="absolute  bg-red-400 w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						112
						<button
							onClick={() => {
								setIsOpen(false);
							}}
						>
							close
						</button>
					</div>
				</div>
			)}
			<button
				onClick={() => {
					setSvgContentTwo(ref?.current?.getHTML());
					// console.log(
					// 	JSON.stringify({
					// 		html: refCopy?.current?.getHTML(),
					// 	})
					// );
					console.log(ref?.current?.getHTML());
				}}
			>
				button
			</button>
			<div className="flex  gap-4 h-screen">
				<div className="w-[600px] h-[400px] border border-red-400 ">
					<div ref={ref} dangerouslySetInnerHTML={{ __html: svgContent! }} onClick={handleSvgClick} />
				</div>

				<div className="w-[600px] h-[400px] border border-red-400">
					<div dangerouslySetInnerHTML={{ __html: svgContentTwo! }} />
				</div>
			</div>
		</div>
	);
}

export default App;
