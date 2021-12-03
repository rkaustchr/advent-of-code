#include<stdio.h>

int main() {
	FILE *fp = fopen("input.txt", "r" );
	int horizontal = 0;
	int depth = 0;

	char move[10];
	int size;

	while ( fscanf(fp, "%s %d", move, &size) == 2 ) {
        //forward
        //up
        //down
        if (strcmp(move, "forward") == 0)
            horizontal += size;

		else if (strcmp(move, "up") == 0)
			depth -= size;

        else if (strcmp(move, "down") == 0)
			depth += size;
	}

	printf("Final Pos: hor %d | depth: %d \n", horizontal, depth);
    printf("Response: %d \n", horizontal * depth);

	fclose( fp );

	return 0;
}
