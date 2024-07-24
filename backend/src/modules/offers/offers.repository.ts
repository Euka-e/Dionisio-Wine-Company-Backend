import { Product } from "../products/entities/product.entity";
import { Offer } from "./entities/offer.entity";
import { Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { Category } from "../categories/entities/category.entity";
import { UpdateOfferDto } from "./dto/update-offer.dto";


@Injectable()
export class OffersRepository{
    constructor(
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
      ) {}
    
      async create(createOfferDto: CreateOfferDto): Promise<Offer[]> {
        const { percentage, productId, categoryId} = createOfferDto;
    
        if (!productId && !categoryId) {
          throw new BadRequestException('Either productId or categoryId must be provided');
        }
    
        const offers: Offer[] = [];
        if (productId) {
          const product = await this.productsRepository.findOne({ where: { id: productId } });
          if (!product) {
            throw new NotFoundException(`Product with id ${productId} not found`);
          }
          product.price = product.price * (1 - percentage / 100);
          await this.productsRepository.save(product);
    
          const offer = this.offerRepository.create({
            percentage,
            productId
          });
          offers.push(await this.offerRepository.save(offer));
        }
    
        if (categoryId) {
          const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
          if (!category) {
            throw new NotFoundException(`Category with id ${categoryId} not found`);
          }
          const products = await this.productsRepository.find({ where: { category: category } });
          for (const product of products) {
            product.price = product.price * (1 - percentage / 100);
            await this.productsRepository.save(product);
    
            const offer = this.offerRepository.create({
              percentage,
              productId: product.id
            });
            offers.push(await this.offerRepository.save(offer));
          }
        }
    
        return offers;
      }

      async findAll(): Promise<Offer[]> {
        return await this.offerRepository.find();
      }

      async findOne(id: string): Promise<Offer> {
        const offer = await this.offerRepository.findOne({ where: { id } });
        if (!offer) {
          throw new NotFoundException(`Offer with id ${id} not found`);
        }
        return offer;
      }

      async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
        const offer = await this.offerRepository.findOne({ where: { id } });
        if (!offer) {
          throw new NotFoundException(`Offer with id ${id} not found`);
        }
    
        const { percentage, productId, categoryId} = updateOfferDto;
        if (productId) {
          const product = await this.productsRepository.findOne({ where: { id: productId } });
          if (!product) {
            throw new NotFoundException(`Product with id ${productId} not found`);
          }
          product.price = product.price * (1 - percentage / 100);
          await this.productsRepository.save(product);
        }
    
        if (categoryId) {
          const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
          if (!category) {
            throw new NotFoundException(`Category with id ${categoryId} not found`);
          }
          const products = await this.productsRepository.find({ where: { category: category } });
          for (const product of products) {
            product.price = product.price * (1 - percentage / 100);
            await this.productsRepository.save(product);
          }
        }
    
        Object.assign(offer, updateOfferDto);
        return await this.offerRepository.save(offer);
      }

      async delete(id: string): Promise<void> {
        const result = await this.offerRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Offer with id ${id} not found`);
        }
      }
}