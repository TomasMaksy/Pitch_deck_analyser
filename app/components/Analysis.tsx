"use client";

import { useRef, useState } from "react";
import { X, FilePlus } from "lucide-react";
import { Divider, Radio, RadioGroup, cn } from "@nextui-org/react";
import { RadioProps } from "@nextui-org/react";
import { Alert } from "@nextui-org/react";
import showdown from "showdown";

import Image from "next/image";
import pyramidImage from "@/app/assets/pyramid.png";
import springImage from "@/app/assets/spring.png";
import tubeImage from "@/app/assets/tube.png";

import { Progress } from "@nextui-org/react";

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
	// Scroll function to scroll to results section
	const scrollToResults = () => {
		setTimeout(() => {
			const analysisResults = document.getElementById("analysis-results");
			if (analysisResults) {
				analysisResults.scrollIntoView({ behavior: "smooth", block: "start" });
			} else {
				console.error("Analysis results element not found!");
			}
		}, 200); // Adjust timeout duration as needed
	};

	const [addedFiles, setFiles] = useState<File[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<{ fileName: string; text: string }[]>(
		[]
	);
	const inputRef = useRef<HTMLInputElement>(null);

	const [alert, setAlert] = useState<{
		message: string;
		type: "success" | "error" | null;
	}>({ message: "", type: null });
	// State to store the value of the input for LLM model
	const [inputValue, setInputValue] = useState<string>("gpt-4o");
	// Event handler to update state on input change
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value); // Set the selected model
	};

	const converter = new showdown.Converter();

	// useEffect(() => {
	// 	// Check if there are results to display
	// 	if (results.length > 0) {
	// 		const index = 0;

	// 		// Iterate through all results
	// 		results.forEach((result) => {
	// 			const currentText = result.text;
	// 			let textIndex = 0;

	// 			const interval = setInterval(() => {
	// 				setTypedText((prevText) => prevText + currentText[textIndex]);
	// 				textIndex++;

	// 				if (textIndex === currentText.length) {
	// 					clearInterval(interval); // Stop once all text is revealed
	// 				}
	// 			}, 1); // Adjust interval for typing speed
	// 		});
	// 	}
	// }, [results]);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			setFiles((prev) => [...prev, ...Array.from(files)]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault(); // This is necessary to allow the drop event to be triggered
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files: inputFiles } = e.target;

		if (inputFiles) {
			setFiles((prev) => [...prev, ...Array.from(inputFiles)]);
		}
	};

	const handleSubmit = async () => {
		if (addedFiles.length === 0) {
			setAlert({ message: "Please add at least one PDF file.", type: "error" });
			return;
		}
		console.log("Model selected", inputValue);
		setResults([]); // Clear previous results
		setIsLoading(true);
		setAlert({ message: "PDF submitted successfully!", type: "success" });
		scrollToResults();

		try {
			const formData = new FormData();
			addedFiles.forEach((file, index) => {
				formData.append(`file-${index}`, file);
			});

			formData.append("model", inputValue);

			const response = await fetch("/api/pdf-parser/", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to process PDFs");
			}

			const data = await response.json();
			const fullResponse = data.gptOutputs || []; // Ensure it's an array

			// Make sure the number of responses matches the number of files
			if (fullResponse.length !== addedFiles.length) {
				throw new Error(
					"The number of responses doesn't match the number of uploaded files"
				);
			}

			// Iterate over the responses and assign the correct file name
			fullResponse.forEach((text: string, index: number) => {
				setResults((prevResults) => [
					...prevResults,
					{
						fileName: addedFiles[index].name, // Use the correct file name based on index
						text,
					},
				]);
			});
		} catch (error) {
			console.error("Error:", error);
			setAlert({
				message: "An error occurred during analysis.",
				type: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section
			id="analysis-section"
			className="pb-24 bg-[radial-gradient(ellipse_200%_50%_at_bottom,#183EC2,#EAEEFE_50%)] overflow-x-hidden"
		>
			<div className="container ">
				<div className=" md:flex-1 relative">
					<Image
						src={pyramidImage}
						alt="Pyramid"
						width={300}
						height={300}
						className="hidden absolute md:absolute md:block -top-0 -left-48 z-10 rotate-[32deg] hover:rotate-[1deg] hover:scale-95 duration-500"
					/>
				</div>
				<div className="flex flex-col items-center align-top text-center">
					<h2 className="text-5xl font-bold text-center pt-20 tracking-tight bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text">
						Analyse your PDFs here
					</h2>
					<p className="mt-6 md:mx-36">
						Upload your pitch decks to quickly determine how well they{" "}
						<strong>fit your investment strategy</strong> and whether they are
						worth further consideration as <strong>potential investment</strong>{" "}
					</p>
				</div>
				<div className="bg-white p-10 mt-12 mb-12 rounded-3xl mb-">
					<div className="flex flex-col md:flex-row gap-5 w-full ">
						{/* First div (input field container) */}
						<div className="flex flex-col justify-between gap-5 w-full">
							<div
								onDrop={handleDrop}
								onDragOver={handleDragOver}
								className="custom-btn custom-btn-primary flex-col items-center gap-2  py-6 hover:bg-slate-900 duration-300 transform hover:scale-105 hover:animate-shake font-semibold rounded-xl w-full dragover:scale-105"
							>
								<input
									type="file"
									name="pdf"
									id="file-input"
									accept="application/pdf"
									className="w-full hidden"
									multiple
									ref={inputRef}
									onChange={handleFileChange}
								/>
								<label
									htmlFor="file-input"
									className="flex flex-col gap-1 items-center justify-center cursor-pointer text-center p-4 w-full"
								>
									<FilePlus className="h-5 w-5" />
									<span className="whitespace-nowrap">
										Drag and Drop or Select a PDF
									</span>
								</label>
							</div>

							{/* Dynamically display uploaded files */}
							<div className="flex flex-col gap-2 mt-5 w-full ">
								{addedFiles.map((file, index) => (
									<div
										key={index}
										className="px-8 custom-border flex flex-row justify-between w-full group"
									>
										<p className="text-sm">{file.name}</p>

										<div className="flex flex-row justify-end gap-4 alig">
											<div className="flex flex-row gap-5 transition-all duration-300 transform group-hover:translate-x-[-15px] group-hover:opacity-0">
												<Divider orientation="vertical" />
												<p className="text-sm">
													{(file.size / (1024 * 1024)).toFixed(2)} MB
												</p>
											</div>
											<button
												onClick={() => {
													setFiles((prev) =>
														prev.filter((_, i) => i !== index)
													);
												}}
												className="hidden h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:block group-hover:translate-x-0 translate-x-[35px] transition-all duration-500"
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
							<RadioGroup
								label="Pick your LLM:"
								defaultValue="gpt-4o"
								value={inputValue}
								onChange={handleInputChange}
							>
								<CustomRadio description="OpenAI Flagship Model" value="gpt-4o">
									GPT 4o
								</CustomRadio>
								<CustomRadio
									description="OpenAI Smaller Model"
									value="gpt-4o-mini"
								>
									GPT4o mini
								</CustomRadio>
								<CustomRadio
									description="Claude AI Flagship Model"
									value="Sonnet 3.5"
									isDisabled={true}
								>
									Sonnet 3.5
								</CustomRadio>
							</RadioGroup>
						</div>
					</div>
					<button
						type="submit"
						onClick={handleSubmit}
						className="custom-btn custom-btn-primary mt-10 w-full py-4 rounded-xl font-semibold disabled:opacity-50 hover:scale-105 duration-300  hover:bg-slate-900"
						disabled={isLoading}
					>
						{isLoading ? <span>Loading...</span> : <span>Submit</span>}
					</button>

					<div className="flex flex-row items-center mt-5">
						{/* Display alerts */}
						{alert.type && (
							<Alert
								color={alert.type === "success" ? "success" : "primary"}
								className="mb-4"
								title={alert.type === "success" ? "Success" : "Error"}
								description={alert.message}
							/>
						)}
					</div>
				</div>
				<div className=" md:flex-1 relative">
					<Image
						src={springImage}
						alt="Spring"
						width={220}
						height={220}
						className="hidden absolute md:absolute md:block -top-16 -right-16 rotate-[-20deg] hover:scale-105 duration-500 hover:rotate-[-8deg]"
					/>
				</div>
				{/* Results Section */}
				<h2
					id="analysis-results"
					className="text-5xl font-bold text-center pt-48 tracking-tight bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text"
				>
					Results
				</h2>

				<div className="flex bg-white p-10 mt-8 rounded-3xl mb-24 min-h-[500px] flex-col justify-center z-50">
					{/* Show progress bar when loading */}
					{isLoading ? (
						<div className="w-full flex items-center justify-center align-middle -mt-12">
							<Progress
								isIndeterminate
								aria-label="Analysing the PDFs..."
								size="md"
								label="Analysing the PDFs..."
								classNames={{
									base: "max-w-lg",
									indicator: "bg-gradient-to-r from-primary to-secondary",
								}}
							/>
						</div>
					) : (
						// Show results when available
						results.length > 0 &&
						results.map((result, index) => (
							<div
								key={index}
								className=" p-8 rounded-3xl mb-4 min-h-[500px] flex items-center justify-center"
							>
								<div className="w-full">
									<h3 className="font-black text-xl">{result.fileName}</h3>
									<Divider />
									<div
										className="text-gray-800 mt-4"
										dangerouslySetInnerHTML={{
											__html: converter.makeHtml(result.text),
										}}
									/>
								</div>
							</div>
						))
					)}
				</div>
				<div className="relative w-full">
					<Image
						src={tubeImage}
						alt="Tube"
						width={330}
						height={330}
						className="hidden absolute md:block -top-[340px] -right-[300px] rotate-[-20deg] hover:scale-95 duration-500 z-10"
					/>
				</div>
			</div>
		</section>
	);
};
