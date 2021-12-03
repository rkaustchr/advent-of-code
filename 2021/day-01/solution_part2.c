#include<stdio.h>

int main() {
	FILE *fp = fopen("input.txt", "r" );
	int num;
	int prev = 0;
	int actual = 0;
	int next = 0;
	int count = 0;

    fscanf(fp, "%d", &num);
    prev = num;
    fscanf(fp, "%d", &num);
    prev += num;
    actual = num;
    fscanf(fp, "%d", &num);
    prev += num;
    actual += num;
    next = num;

	while ( fscanf(fp, "%d", &num) == 1 ) {
        actual += num;
        if (actual > prev)
            count++;

        prev = actual;
        actual = next + num;
        next = num;
	}

	printf("Count: %d \n", count);

	fclose( fp );

	return 0;
}
