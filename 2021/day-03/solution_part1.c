#include<stdio.h>
#include<math.h>

#define MAX_BITS 15

void countReport(char* report, int reportSize, long int* bitCount) {
    for(int i=0; i < reportSize; i++) {
        if ( report[i] == '1' )
            bitCount[i]++;
        else
            bitCount[i]--;
    }
}

int binary_to_decimal(char* binary, int len) {
    int dec = 0;
    int temp;
    for(int i=0; i < len; i++) {
        temp = binary[len-i-1] == '1' ? pow(2, i) : 0;
        dec += temp;
    }

    return dec;
}

int main() {
	FILE *fp = fopen("input.txt", "r" );
	char report[MAX_BITS];
	long int bitCount[MAX_BITS];
	int bitsSize;
	char gamma[MAX_BITS];
	char epsilon[MAX_BITS];
	int gammaDec;
	int epsilonDec;

	fscanf(fp, "%s", report);
	bitsSize = strlen(report);

	for(int i=0; i < bitsSize; i++)
        bitCount[i] = 0;

	countReport(report, bitsSize, &bitCount);

	while ( fscanf(fp, "%s", report) == 1 ) {
        countReport(report, bitsSize, &bitCount);
	}

	for(int i=0; i < bitsSize; i++) {
        printf(" %d ", bitCount[i]);
        if ( bitCount[i] > 0 ) {
            gamma[i] = '1';
            epsilon[i] = '0';
        } else {
            gamma[i] = '0';
            epsilon[i] = '1';
        }
	}
	printf("\n");

	for(int i=0; i < bitsSize; i++) {
        printf(" %c ", gamma[i]);
	}
	printf("\n");

	for(int i=0; i < bitsSize; i++) {
        printf(" %c ", epsilon[i]);
	}
	printf("\n");

    gamma[bitsSize] = '\0';
    epsilon[bitsSize] = '\0';

    gammaDec = binary_to_decimal(gamma, bitsSize);
    epsilonDec = binary_to_decimal(epsilon, bitsSize);

    printf("Final Pos: gamma %d | epsilon: %d \n", gammaDec, epsilonDec);
    printf("Response: %d \n", gammaDec * epsilonDec);

	fclose( fp );

	return 0;
}
