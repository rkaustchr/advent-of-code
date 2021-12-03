#include<stdio.h>

int main() {
	FILE *fp = fopen("input.txt", "r" );
	int num;
	int prev = 10000000; // MAX_INT
	int count = 0;

	while ( fscanf(fp, "%d", &num) == 1 ) {

		if (num > prev)
			count++;

		prev = num;
	}

	printf("Count: %d \n", count);

	fclose( fp );

	return 0;
}
