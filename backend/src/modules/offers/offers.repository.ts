import { Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscountCode } from "./entities/discountCode.entity";
import { GenerateDiscountCodeDto } from "./dto/discountCode.dto";
import { ApplyDiscountCodeDto } from "./dto/applyCode.dto";


@Injectable()
export class OffersRepository{
    constructor(
        @InjectRepository(DiscountCode)
        private discountCodeRepository: Repository<DiscountCode>,
    
      ) {}



      async generateCode(dto: GenerateDiscountCodeDto): Promise<DiscountCode> {
        const code = this.generateRandomCode();
        const discountCode = this.discountCodeRepository.create({ ...dto, code });
        return await this.discountCodeRepository.save(discountCode);
      }
    
      async applyCode(dto: ApplyDiscountCodeDto): Promise<number> {
        const discountCode = await this.discountCodeRepository.findOne({ where: { code: dto.code } });
    
        if (!discountCode) {
          throw new NotFoundException('Discount code not found');
        }
    
        if (discountCode.used) {
          throw new BadRequestException('Discount code already used');
        }
    
        discountCode.used = true;
        await this.discountCodeRepository.save(discountCode);
    
        return discountCode.percentage;
      }
    
      private generateRandomCode(length: number = 8): string {
        return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
      }
    }