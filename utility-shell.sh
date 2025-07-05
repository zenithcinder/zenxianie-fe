#!/bin/bash

# Define the source directory and output file
SOURCE_DIR="src/components/ui"
OUTPUT_FILE="ui-files.txt"

# Find all files in the source directory and write their names to the output file
find "$SOURCE_DIR" -type f -exec basename {} \; > "$OUTPUT_FILE"

echo "File names from $SOURCE_DIR have been saved to $OUTPUT_FILE."