#include<stdio.h>

int main() {
	FILE *fp = fopen("input.txt", "r" );
	int horizontal = 0;
	int depth = 0;
	int aim = 0;

	char move[10];
	int size;

	while ( fscanf(fp, "%s %d", move, &size) == 2 ) {
        //forward
        //up
        //down

        // down X increases your aim by X units.
        // up X decreases your aim by X units.
        // forward X does two things:
        // It increases your horizontal position by X units.
        // It increases your depth by your aim multiplied by X.
         if (strcmp(move, "forward") == 0) {
            horizontal += size;
            depth += aim * size;
         }

		else if (strcmp(move, "up") == 0)
			aim -= size;

        else if (strcmp(move, "down") == 0)
			aim += size;
	}

	printf("Final Pos: hor %d | depth: %d \n", horizontal, depth);
    printf("Response: %d \n", horizontal * depth);

	fclose( fp );

	return 0;
}
