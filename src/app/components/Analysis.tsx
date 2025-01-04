"use client";

import { useRef, useState } from "react";
import { X, FilePlus } from "lucide-react";
import { Divider, Radio, RadioGroup, cn } from "@nextui-org/react";
import { RadioProps } from "@nextui-org/react";

export const CustomRadio = (props: RadioProps) => {
	const { children, ...otherProps } = props;

	return (
		<Radio
			{...otherProps}
			classNames={{
				base: cn(
					"inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
					"flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
					"data-[selected=true]:border-primary"
				),
			}}
		>
			{children}
		</Radio>
	);
};

export const Analysis = () => {
	const [addedFiles, setFiles] = useState<File[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files: inputFiles } = e.target;

		if (inputFiles) {
			setFiles((prev) => [...prev, ...Array.from(inputFiles)]);
		}
	};

	const handleSubmit = async () => submitFiles(addedFiles);

	return (
		<section className="pb-24 bg-[radial-gradient(ellipse_200%_50%_at_bottom,#183EC2,#EAEEFE_50%)]">
			<div className="container">
				<h2 className="text-5xl font-bold text-center pt-20 tracking-tight bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text">
					Analyse your PDFs here
				</h2>
				<div className="bg-white p-10 mt-12 rounded-3xl mb-12">
					<div className="flex flex-col md:flex-row gap-5 ">
						{/* First div (input field container) */}
						<div className="flex flex-col justify-between gap-5 w-full">
							<div className="custom-btn custom-btn-primary flex-col items-center gap-2 md:px-36 py-6 hover:bg-slate-900 duration-300 transform hover:scale-105 hover:animate-shake font-semibold rounded-3xl w-full">
								<input
									type="file"
									name="pdf"
									id="file-input"
									accept="application/pdf"
									className="hidden"
									multiple
									ref={inputRef}
									onChange={handleFileChange}
								/>
								<label
									htmlFor="file-input"
									className="flex flex-col gap-1 items-center justify-center cursor-pointer w-full text-center"
								>
									<FilePlus className="h-5 w-5" />
									<span className="whitespace-nowrap">Upload PDF</span>
								</label>
							</div>

							{/* Dynamically display uploaded files */}
							<div className="flex flex-col gap-2 mt-5 w-full">
								{addedFiles.map((file, index) => (
									<div
										key={index}
										className="px-8 custom-border flex flex-row justify-between w-full group"
									>
										<p>{file.name}</p>

										<div className="flex flex-row justify-end gap-4">
											<Divider orientation="vertical" />
											<p className="transition-all duration-300 transform group-hover:translate-x-[-35px] group-hover:opacity-0">
												{(file.size / (1024 * 1024)).toFixed(2)} MB
											</p>
											<button
												onClick={() => {
													setFiles((prev) =>
														prev.filter((_, i) => i !== index)
													);
												}}
												className="hidden h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:block group-hover:translate-x-0 translate-x-[35px] transition-all duration-300"
											>
												<X />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<Divider orientation="vertical" />
						<div className="flex-col gap-5 w-full mt-12 md:mt-0">
							<RadioGroup label="Pick you LLM model">
								<CustomRadio
									description="ChatGPT Flagship Model"
									value="GPT 4o"
								>
									GPT 4o
								</CustomRadio>
								<CustomRadio
									description="ChatGPT Smaller Model"
									value="GPT4o mini"
								>
									GPT4o mini
								</CustomRadio>
								<CustomRadio
									description="Claude AI Flagship Model"
									value="Sonnet 3.5"
								>
									Sonnet 3.5
								</CustomRadio>
							</RadioGroup>
						</div>
					</div>
					<button
						type="submit"
						onClick={handleSubmit}
						className="custom-btn custom-btn-primary mt-10 w-full py-4 rounded-3xl font-semibold"
					>
						<span>Submit</span>
					</button>
				</div>
			</div>
		</section>
	);
};
